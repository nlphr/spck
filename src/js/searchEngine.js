/**
 * Cách dùng:
 * 1. Thêm file này vào cuối trang: <script src="./src/js/simple-search.js"></script>
 * 2. Thêm ô input để tìm kiếm (id="...-search") và ô nhập giá (id="...-min", id="...-max")
 * 3. Gọi SimpleSearch.attach({...}) để gắn chức năng tìm kiếm
 * !!--- CHỈ DÙNG CHO ADMIN ---!!
 **/

(function () {
  // Giảm số lần chạy hàm khi gõ liên tục (debounce)
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Thoát ký tự đặc biệt để dùng trong regex
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Xóa highlight cũ (thẻ <mark>) trong phần tử
  function stripHighlights(el) {
    el.querySelectorAll("mark.__ss__").forEach((m) => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }

  // Thêm highlight (tô vàng) cho đoạn text khớp từ khóa
  function applyHighlight(el, query, textSelector) {
    if (!query) return;
    const target = textSelector ? el.querySelector(textSelector) : el;
    if (!target) return;

    const q = escapeRegExp(query);
    const regex = new RegExp(`(${q})`, "ig");

    // Duyệt qua các text node bên trong
    const walker = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      null
    );
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const parent = node.parentNode;
      if (!regex.test(node.nodeValue)) return;

      const frag = document.createDocumentFragment();
      let lastIdx = 0;

      node.nodeValue.replace(regex, (match, p1, offset) => {
        if (offset > lastIdx) {
          frag.appendChild(
            document.createTextNode(node.nodeValue.slice(lastIdx, offset))
          );
        }
        const mark = document.createElement("mark");
        mark.className = "__ss__"; // class riêng để dễ xóa
        mark.textContent = match;
        frag.appendChild(mark);
        lastIdx = offset + match.length;
      });

      if (lastIdx < node.nodeValue.length) {
        frag.appendChild(
          document.createTextNode(node.nodeValue.slice(lastIdx))
        );
      }
      parent.replaceChild(frag, node);
    });
  }

  // Chuẩn hóa text: bỏ dấu tiếng Việt, chuyển về chữ thường
  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFD") // tách dấu (â -> a + ˆ)
      .replace(/[\u0300-\u036f]/g, ""); // xóa dấu
  }

  // ----------------- ĐỐI TƯỢNG CHÍNH -----------------
  const searchEngine = {
    attach(cfg) {
      // Xác định input và list
      const input =
        typeof cfg.input === "string"
          ? document.querySelector(cfg.input)
          : cfg.input;
      const list =
        typeof cfg.list === "string"
          ? document.querySelector(cfg.list)
          : cfg.list;
      if (!input || !list) {
        console.warn("searchEngine: Không tìm thấy input hoặc list");
        return;
      }

      const itemSel = cfg.item || "li"; // mặc định mỗi mục là <li>
      const items = () => Array.from(list.querySelectorAll(itemSel));
      const getText = (el) => {
        if (cfg.textSelector) {
          const t = el.querySelector(cfg.textSelector);
          return t ? t.textContent : el.textContent;
        }
        return el.textContent;
      };

      // Cấu hình lọc theo giá (nếu có)
      const priceCfg = cfg.price || null;
      const minInput =
        priceCfg && priceCfg.minInput
          ? document.querySelector(priceCfg.minInput)
          : null;
      const maxInput =
        priceCfg && priceCfg.maxInput
          ? document.querySelector(priceCfg.maxInput)
          : null;
      const getPrice =
        priceCfg && typeof priceCfg.getPrice === "function"
          ? priceCfg.getPrice
          : null;

      // Hàm chính: lọc dữ liệu
      function run() {
        const q = normalize(input.value); // từ khóa tìm kiếm
        const min = minInput ? parseFloat(minInput.value) : NaN; // giá min
        const max = maxInput ? parseFloat(maxInput.value) : NaN; // giá max

        items().forEach((el) => {
          // Xóa highlight cũ
          stripHighlights(el);
          let ok = true;

          // Kiểm tra text có chứa từ khóa không
          if (q) {
            const hay = normalize(getText(el));
            ok = hay.includes(q);
          }

          // Kiểm tra điều kiện giá
          if (ok && getPrice && (minInput || maxInput)) {
            const p = getPrice(el);
            if (!isNaN(min) && !(p >= min)) ok = false;
            if (!isNaN(max) && !(p <= max)) ok = false;
          }

          // Hiện hoặc ẩn item
          el.style.display = ok ? "" : "none";

          // Nếu hợp lệ và có yêu cầu highlight → đánh dấu
          if (ok && cfg.highlight && q)
            applyHighlight(el, input.value, cfg.textSelector);
        });
      }

      // Thêm event gõ phím + nhập giá (có debounce)
      const debounced = debounce(run, cfg.debounceMs || 120);
      input.addEventListener("input", debounced);
      if (minInput) minInput.addEventListener("input", debounced);
      if (maxInput) maxInput.addEventListener("input", debounced);
    },
  };

  // Gắn ra toàn cục (window) để gọi ngoài file
  window.searchEngine = searchEngine;
})();
