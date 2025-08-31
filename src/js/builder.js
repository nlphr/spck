// PC Builder - Main functionality
class PCBuilder {
  constructor() {
    this.selectedParts = {
      cpu: null,
      gpu: null,
      mainboard: null,
      ram: null,
      storage: null,
      psu: null,
      case: null,
      cooler: null
    };
    
    this.partsData = {
      cpu: [],
      gpu: [],
      mainboard: [],
      ram: [],
      storage: [],
      psu: [],
      case: [],
      cooler: []
    };
    
    this.init();
  }

  async init() {
    await this.loadAllParts();
    this.setupEventListeners();
    this.updateBuildSummary();
  }

  // Load all parts from Firebase
  async loadAllParts() {
    const collections = [
      { name: 'cpu', collection: 'cpuData' },
      { name: 'gpu', collection: 'gpuData' },
      { name: 'mainboard', collection: 'mainboardData' },
      { name: 'ram', collection: 'ramData' },
      { name: 'storage', collection: 'storageData' },
      { name: 'psu', collection: 'powerSupplyData' },
      { name: 'case', collection: 'caseData' },
      { name: 'cooler', collection: 'cpuCoolerData' }
    ];

    for (const { name, collection } of collections) {
      try {
        const snapshot = await db.collection(collection).get();
        this.partsData[name] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        this.populateDropdown(name);
      } catch (error) {
        console.error(`Error loading ${name} data:`, error);
      }
    }
  }

  // Populate dropdown with parts
  populateDropdown(partType) {
    const select = document.getElementById(`${partType}-select`);
    if (!select) return;

    // Clear existing options except the first one
    select.innerHTML = `<option value="">Select ${partType.toUpperCase()}</option>`;

    // Add parts to dropdown
    this.partsData[partType].forEach(part => {
      const option = document.createElement('option');
      option.value = part.id;
      option.textContent = `${part.title} - $${part.price}`;
      option.dataset.part = JSON.stringify(part);
      select.appendChild(option);
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Part selection dropdowns
    const selects = document.querySelectorAll('.part-select');
    selects.forEach(select => {
      select.addEventListener('change', (e) => this.handlePartSelection(e));
    });

    // Remove buttons
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.handlePartRemoval(e));
    });

    // Build action buttons
    document.getElementById('save-build-btn')?.addEventListener('click', () => this.saveBuild());
    document.getElementById('clear-build-btn')?.addEventListener('click', () => this.clearBuild());
  }

  // Handle part selection
  handlePartSelection(event) {
    const select = event.target;
    const partType = select.id.replace('-select', '');
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption.value) {
      const partData = JSON.parse(selectedOption.dataset.part);
      this.selectedParts[partType] = partData;
      this.updateComponentDisplay(partType, partData);
    } else {
      this.selectedParts[partType] = null;
      this.updateComponentDisplay(partType, null);
    }

    this.updateBuildSummary();
    this.checkCompatibility();
  }

  // Handle part removal
  handlePartRemoval(event) {
    const partType = event.target.dataset.part;
    this.selectedParts[partType] = null;
    
    // Reset dropdown
    const select = document.getElementById(`${partType}-select`);
    if (select) select.value = '';
    
    this.updateComponentDisplay(partType, null);
    this.updateBuildSummary();
    this.checkCompatibility();
  }

  // Update component display
  updateComponentDisplay(partType, partData) {
    const component = document.querySelector(`[data-part="${partType}"]`);
    if (!component) return;

    const status = component.querySelector('.component-status');
    const price = component.querySelector('.component-price');
    const removeBtn = component.querySelector('.btn-remove');
    const select = component.querySelector('.part-select');

    if (partData) {
      status.textContent = 'Selected';
      status.className = 'component-status selected';
      
      // Show detailed component info instead of just price
      const componentInfo = this.getComponentInfo(partType, partData);
      price.innerHTML = componentInfo;
      
      removeBtn.style.display = 'block';
      select.style.display = 'none';
    } else {
      status.textContent = 'Not Selected';
      status.className = 'component-status not-selected';
      price.textContent = '$0.00';
      removeBtn.style.display = 'none';
      select.style.display = 'block';
    }
  }

  // Get detailed component information
  getComponentInfo(partType, partData) {
    const price = `$${partData.price}`;
    let details = '';

    switch (partType) {
      case 'cpu':
        details = `${partData.coreCount || 'N/A'} cores, ${partData.performanceCoreClock || 'N/A'} GHz`;
        if (partData.TPD) details += `, ${partData.TPD}W TDP`;
        break;
      case 'gpu':
        details = `${partData.chipset || 'N/A'}, ${partData.memory || 'N/A'}`;
        if (partData.coreClock) details += `, ${partData.coreClock}`;
        break;
      case 'mainboard':
        details = `${partData.cpuSocket || 'N/A'}, ${partData.chipset || 'N/A'}`;
        if (partData.formFactor) details += `, ${partData.formFactor}`;
        break;
      case 'ram':
        details = `${partData.speed || 'N/A'}, ${partData.modules || 'N/A'} modules`;
        if (partData.casLatency) details += `, CL${partData.casLatency}`;
        break;
      case 'storage':
        details = `${partData.capacity || 'N/A'}, ${partData.type || 'N/A'}`;
        if (partData.formFactor) details += `, ${partData.formFactor}`;
        break;
      case 'psu':
        details = `${partData.wattage || 'N/A'}W, ${partData.efficiency || 'N/A'}`;
        if (partData.modular) details += `, ${partData.modular}`;
        break;
      case 'case':
        details = `${partData.type || 'N/A'}, ${partData.formFactor || 'N/A'}`;
        if (partData.externalVolume) details += `, ${partData.externalVolume}`;
        break;
      case 'cooler':
        details = `${partData.radiatorSize || 'N/A'}, ${partData.fanRPM || 'N/A'} RPM`;
        if (partData.noiseLevel) details += `, ${partData.noiseLevel} dB`;
        break;
      default:
        details = partData.title;
    }

    return `<div class="component-price-main">${price}</div><div class="component-details-small">${details}</div>`;
  }

  // Update selected components list in build preview
  updateSelectedComponentsList() {
    const selectedComponents = Object.entries(this.selectedParts)
      .filter(([_, part]) => part !== null)
      .map(([type, part]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        title: part.title,
        price: part.price
      }));

    // Create or update the selected components section
    let selectedComponentsSection = document.getElementById('selected-components-list');
    if (!selectedComponentsSection) {
      // Create the section if it doesn't exist
      const buildPreview = document.querySelector('.build-preview');
      const buildSummary = document.querySelector('.build-summary');
      
      selectedComponentsSection = document.createElement('div');
      selectedComponentsSection.id = 'selected-components-list';
      selectedComponentsSection.className = 'selected-components-list';
      
      // Insert after build summary
      buildSummary.parentNode.insertBefore(selectedComponentsSection, buildSummary.nextSibling);
    }

    if (selectedComponents.length > 0) {
      selectedComponentsSection.innerHTML = `
        <div class="selected-components-header">
          <h3>Selected Components</h3>
        </div>
        <div class="selected-components-grid">
          ${selectedComponents.map(comp => `
            <div class="selected-component-item">
              <div class="selected-component-type">${comp.type}</div>
              <div class="selected-component-title">${comp.title}</div>
              <div class="selected-component-price">$${comp.price}</div>
            </div>
          `).join('')}
        </div>
      `;
      selectedComponentsSection.style.display = 'block';
    } else {
      selectedComponentsSection.style.display = 'none';
    }
  }

  // Update build summary
  updateBuildSummary() {
    const selectedCount = Object.values(this.selectedParts).filter(part => part !== null).length;
    const totalPrice = Object.values(this.selectedParts)
      .filter(part => part !== null)
      .reduce((sum, part) => sum + (part.price || 0), 0);
    
    const totalWattage = this.calculateEstimatedWattage();

    // Update counters
    document.getElementById('components-count').textContent = `${selectedCount}/8`;
    
    // Update build price with wattage info
    const buildPriceElement = document.getElementById('build-price');
    buildPriceElement.innerHTML = `
      <div class="total-price-main">$${totalPrice.toFixed(2)}</div>
      <div class="total-wattage">${totalWattage}W Estimated</div>
    `;

    // Update selected components list
    this.updateSelectedComponentsList();

    // Update build status
    const buildStatus = document.getElementById('build-status');
    if (selectedCount === 8) {
      buildStatus.textContent = 'Complete';
      buildStatus.className = 'summary-value complete';
    } else if (selectedCount > 0) {
      buildStatus.textContent = 'In Progress';
      buildStatus.className = 'summary-value in-progress';
    } else {
      buildStatus.textContent = 'Incomplete';
      buildStatus.className = 'summary-value incomplete';
    }
  }

  // Basic compatibility checking
  checkCompatibility() {
    const warnings = [];
    const { cpu, mainboard, ram, psu } = this.selectedParts;

    // CPU and Motherboard socket compatibility
    if (cpu && mainboard) {
      if (cpu.socket && mainboard.cpuSocket && cpu.socket !== mainboard.cpuSocket) {
        warnings.push(`CPU socket (${cpu.socket}) may not be compatible with motherboard socket (${mainboard.cpuSocket})`);
      }
    }

    // RAM and Motherboard compatibility
    if (ram && mainboard) {
      if (ram.type && mainboard.memoryType && ram.type !== mainboard.memoryType) {
        warnings.push(`RAM type (${ram.type}) may not be compatible with motherboard memory type (${mainboard.memoryType})`);
      }
    }

    // Power supply wattage check
    if (psu && (cpu || gpu)) {
      const estimatedWattage = this.calculateEstimatedWattage();
      const psuWattage = parseInt(psu.wattage) || 0;
      
      if (estimatedWattage > psuWattage * 0.8) { // 80% rule
        warnings.push(`Power supply (${psuWattage}W) may be insufficient for your components (estimated ${estimatedWattage}W)`);
      }
    }

    this.displayWarnings(warnings);
  }

  // Calculate estimated wattage
  calculateEstimatedWattage() {
    let wattage = 0;
    
    if (this.selectedParts.cpu) {
      const tdp = parseInt(this.selectedParts.cpu.TPD) || 0;
      wattage += tdp;
    }
    
    if (this.selectedParts.gpu) {
      // Rough GPU wattage estimation based on common values
      const gpuName = this.selectedParts.gpu.title.toLowerCase();
      if (gpuName.includes('rtx 4090') || gpuName.includes('rtx 4080')) wattage += 320;
      else if (gpuName.includes('rtx 4070') || gpuName.includes('rtx 3080')) wattage += 220;
      else if (gpuName.includes('rtx 3060') || gpuName.includes('rx 6700')) wattage += 170;
      else wattage += 150; // Default estimate
    }

    // Add base system wattage
    wattage += 100; // Motherboard, RAM, storage, etc.
    
    return wattage;
  }

  // Display compatibility warnings
  displayWarnings(warnings) {
    const warningsContainer = document.getElementById('compatibility-warnings');
    const warningsList = document.getElementById('warnings-list');

    if (warnings.length > 0) {
      warningsList.innerHTML = warnings.map(warning => 
        `<div class="warning-item">• ${warning}</div>`
      ).join('');
      warningsContainer.style.display = 'block';
    } else {
      warningsContainer.style.display = 'none';
    }
  }

  // Save build (placeholder)
  saveBuild() {
    const selectedCount = Object.values(this.selectedParts).filter(part => part !== null).length;
    
    if (selectedCount === 0) {
      alert('Please select at least one component before saving.');
      return;
    }

    // For now, just show a success message
    alert('Build saved successfully! (This is a demo - no actual saving implemented)');
  }

  // Clear all selections
  clearBuild() {
    if (confirm('Are you sure you want to clear all selected parts?')) {
      this.selectedParts = {
        cpu: null,
        gpu: null,
        mainboard: null,
        ram: null,
        storage: null,
        psu: null,
        case: null,
        cooler: null
      };

      // Reset all dropdowns
      const selects = document.querySelectorAll('.part-select');
      selects.forEach(select => {
        select.value = '';
        select.style.display = 'block';
      });

      // Reset all component displays
      Object.keys(this.selectedParts).forEach(partType => {
        this.updateComponentDisplay(partType, null);
      });

      this.updateBuildSummary();
      this.checkCompatibility();
    }
  }
}

// Initialize the builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PCBuilder();
});
