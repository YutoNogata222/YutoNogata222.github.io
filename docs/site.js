function normalizeText(text) {
      return text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    }

    function getDateValue(entry, attributeName) {
      const value = entry.getAttribute(attributeName);

      if (!value) {
        return null;
      }

      return new Date(value);
    }

    function sortPublicationEntries(order, basis) {
      const list = document.getElementById("publication-list");
      const entries = Array.from(list.getElementsByClassName("publication-entry"));

      entries.sort(function(a, b) {
        if (basis === "arxiv") {
          const dateA = getDateValue(a, "data-arxiv-date");
          const dateB = getDateValue(b, "data-arxiv-date");

          if (order === "asc") {
            return dateA - dateB;
          }
          return dateB - dateA;
        }

        const statusA = a.getAttribute("data-paper-status");
        const statusB = b.getAttribute("data-paper-status");
        const isPublishedA = statusA === "published";
        const isPublishedB = statusB === "published";

        if (isPublishedA && !isPublishedB) {
          return -1;
        }

        if (!isPublishedA && isPublishedB) {
          return 1;
        }

        if (isPublishedA && isPublishedB) {
          const paperDateA = getDateValue(a, "data-paper-date");
          const paperDateB = getDateValue(b, "data-paper-date");

          if (order === "asc") {
            return paperDateA - paperDateB;
          }
          return paperDateB - paperDateA;
        }

        const arxivDateA = getDateValue(a, "data-arxiv-date");
        const arxivDateB = getDateValue(b, "data-arxiv-date");

        if (order === "asc") {
          return arxivDateA - arxivDateB;
        }
        return arxivDateB - arxivDateA;
      });

      entries.forEach(function(entry) {
        list.appendChild(entry);
      });
    }

    function sortTalkEntries(order) {
      const list = document.getElementById("talk-list");
      const entries = Array.from(list.getElementsByClassName("talk-entry"));

      entries.sort(function(a, b) {
        const dateA = new Date(a.getAttribute("data-date"));
        const dateB = new Date(b.getAttribute("data-date"));

        if (order === "asc") {
          return dateA - dateB;
        }
        return dateB - dateA;
      });

      entries.forEach(function(entry) {
        list.appendChild(entry);
      });
    }

    function filterEntries(listId, entryClass, query, noResultsId) {
      const list = document.getElementById(listId);
      const entries = Array.from(list.getElementsByClassName(entryClass));
      const normalizedQuery = normalizeText(query);
      let visibleCount = 0;

      entries.forEach(function(entry) {
        const text = normalizeText(entry.innerText);
        const isVisible = normalizedQuery === "" || text.includes(normalizedQuery);

        entry.style.display = isVisible ? "" : "none";

        if (isVisible) {
          visibleCount += 1;
        }
      });

      const noResults = document.getElementById(noResultsId);
      noResults.style.display = visibleCount === 0 ? "block" : "none";
    }

    function setupPublicationControls() {
      const searchInput = document.getElementById("pub-search");
      const basisSelect = document.getElementById("pub-basis");
      const sortSelect = document.getElementById("pub-sort");

      function update() {
        sortPublicationEntries(sortSelect.value, basisSelect.value);
        filterEntries("publication-list", "publication-entry", searchInput.value, "pub-no-results");
      }

      searchInput.addEventListener("input", update);
      basisSelect.addEventListener("change", update);
      sortSelect.addEventListener("change", update);

      update();
    }

    function setupTalkControls() {
      const searchInput = document.getElementById("talk-search");
      const sortSelect = document.getElementById("talk-sort");

      function update() {
        sortTalkEntries(sortSelect.value);
        filterEntries("talk-list", "talk-entry", searchInput.value, "talk-no-results");
      }

      searchInput.addEventListener("input", update);
      sortSelect.addEventListener("change", update);

      update();
    }

    setupPublicationControls();
    setupTalkControls();
