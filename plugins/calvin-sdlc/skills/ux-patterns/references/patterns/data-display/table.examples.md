# Data Table: demo code

**Sections (line range):** basic 7-137 · filterable 138-428 · paginated 429-901 · sortable 902-1150

Code of the live demos on https://uxpatterns.dev/patterns/data-display/table. Plain HTML, CSS and JS.

## basic

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Status</th>
        <th>Last Login</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>John Doe</strong></td>
        <td>john@example.com</td>
        <td>Admin</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-15</td>
      </tr>
      <tr>
        <td><strong>Jane Smith</strong></td>
        <td>jane@example.com</td>
        <td>Editor</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-14</td>
      </tr>
      <tr>
        <td><strong>Bob Johnson</strong></td>
        <td>bob@example.com</td>
        <td>Viewer</td>
        <td><span class="status-badge status-inactive">Inactive</span></td>
        <td>2024-01-10</td>
      </tr>
      <tr>
        <td><strong>Alice Brown</strong></td>
        <td>alice@example.com</td>
        <td>Editor</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-15</td>
      </tr>
      <tr>
        <td><strong>Charlie Davis</strong></td>
        <td>charlie@example.com</td>
        <td>Admin</td>
        <td><span class="status-badge status-active">Active</span></td>
        <td>2024-01-13</td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  td {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: #111827;
  }

  .status-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
  }

  .status-active {
    background: #d1fae5;
    color: #065f46;
  }

  .status-inactive {
    background: #f3f4f6;
    color: #374151;
  }
```

## filterable

```html
<div class="container">
  <!-- Filter Controls -->
  <div class="filter-controls">
    <div class="filter-group" style="flex: 2;">
      <label for="search">Search</label>
      <input type="text" id="search" placeholder="Search products...">
    </div>
    
    <div class="filter-group">
      <label for="category">Category</label>
      <select id="category">
        <option value="all">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label for="status">Status</label>
      <select id="status">
        <option value="all">All Statuses</option>
        <option value="available">Available</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>
    </div>
  </div>

  <!-- Results Count -->
  <div class="results-count" id="resultsCount">
    Showing 8 of 8 products
  </div>

  <!-- Table -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        <!-- Table rows will be rendered here -->
      </tbody>
    </table>
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Filter Controls */
  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .filter-group {
    flex: 1;
    min-width: 200px;
  }

  .filter-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .filter-group input,
  .filter-group select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: white;
    transition: border-color 0.2s;
  }

  .filter-group input:focus,
  .filter-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Results Count */
  .results-count {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  /* Table Styles */
  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  td {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: #111827;
  }

  td.numeric {
    text-align: right;
    font-family: 'SF Mono', Monaco, monospace;
  }

  .status-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    text-transform: capitalize;
  }

  .status-available {
    background: #d1fae5;
    color: #065f46;
  }

  .status-low-stock {
    background: #fef3c7;
    color: #92400e;
  }

  .status-out-of-stock {
    background: #fee2e2;
    color: #991b1b;
  }

  .no-results {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }
```

```js
// Data
  const products = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299, stock: 15, status: 'available' },
    { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 29, stock: 3, status: 'low-stock' },
    { id: 3, name: 'Office Chair', category: 'Furniture', price: 299, stock: 0, status: 'out-of-stock' },
    { id: 4, name: 'Standing Desk', category: 'Furniture', price: 599, stock: 8, status: 'available' },
    { id: 5, name: 'USB-C Cable', category: 'Electronics', price: 19, stock: 50, status: 'available' },
    { id: 6, name: 'Monitor 4K', category: 'Electronics', price: 449, stock: 2, status: 'low-stock' },
    { id: 7, name: 'Desk Lamp', category: 'Furniture', price: 45, stock: 20, status: 'available' },
    { id: 8, name: 'Keyboard Mechanical', category: 'Electronics', price: 149, stock: 0, status: 'out-of-stock' },
  ];

  let filteredData = [...products];

  // Render table
  function renderTable() {
    const tbody = document.getElementById('tableBody');
    
    if (filteredData.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="no-results">No products found matching your filters</td></tr>';
      return;
    }
    
    tbody.innerHTML = filteredData.map(product => `
      <tr>
        <td><strong>${product.name}</strong></td>
        <td>${product.category}</td>
        <td class="numeric">$${product.price}</td>
        <td class="numeric">${product.stock}</td>
        <td>
          <span class="status-badge status-${product.status}">
            ${product.status.replace('-', ' ')}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // Update results count
  function updateResultsCount() {
    const count = document.getElementById('resultsCount');
    count.textContent = `Showing ${filteredData.length} of ${products.length} products`;
  }

  // Filter function
  function applyFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const categoryFilter = document.getElementById('category').value;
    const statusFilter = document.getElementById('status').value;
    
    filteredData = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    updateResultsCount();
    renderTable();
  }

  // Debounce function for search input
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Event listeners
  const debouncedFilter = debounce(applyFilters, 300);
  
  document.getElementById('search').addEventListener('input', debouncedFilter);
  document.getElementById('category').addEventListener('change', applyFilters);
  document.getElementById('status').addEventListener('change', applyFilters);

  // Initial render
  renderTable();
```

## paginated

```html
<div class="container">
  <!-- Selection Summary -->
  <div class="selection-summary hidden" id="selectionSummary">
    <span class="selection-text" id="selectionText">0 rows selected</span>
    <button class="clear-selection" onclick="clearSelection()">Clear selection</button>
  </div>

  <!-- Table -->
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="checkbox-col">
            <input type="checkbox" id="selectAll" onchange="handleSelectAll()">
          </th>
          <th>Transaction ID</th>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th style="text-align: right;">Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="tableBody">
        <!-- Table rows will be rendered here -->
      </tbody>
    </table>
  </div>

  <!-- Pagination Controls -->
  <div class="pagination-controls">
    <div class="items-per-page">
      <span>Show</span>
      <select id="itemsPerPage" onchange="changeItemsPerPage()">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
      <span id="resultsText">of 50 results</span>
    </div>

    <div class="pagination-nav">
      <button class="pagination-btn" onclick="previousPage()" id="prevBtn">Previous</button>
      <div id="pageButtons"></div>
      <button class="pagination-btn" onclick="nextPage()" id="nextBtn">Next</button>
    </div>
  </div>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Selection Summary */
  .selection-summary {
    background: #dbeafe;
    border: 1px solid #93c5fd;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selection-summary.hidden {
    display: none;
  }

  .selection-text {
    font-size: 0.875rem;
    color: #1e40af;
  }

  .clear-selection {
    font-size: 0.875rem;
    color: #2563eb;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
  }

  .clear-selection:hover {
    color: #1d4ed8;
  }

  /* Table Styles */
  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  th.checkbox-col,
  td.checkbox-col {
    width: 3rem;
    padding: 0.75rem;
  }

  tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  tbody tr.selected {
    background: #eff6ff;
  }

  td {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: #111827;
  }

  td.numeric {
    text-align: right;
    font-family: 'SF Mono', Monaco, monospace;
  }

  .amount-credit {
    color: #059669;
    font-weight: 500;
  }

  .status-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
  }

  .status-completed {
    background: #d1fae5;
    color: #065f46;
  }

  .status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  .status-failed {
    background: #fee2e2;
    color: #991b1b;
  }

  /* Checkbox Styles */
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  input[type="checkbox"]:checked {
    background: #3b82f6;
    border-color: #3b82f6;
  }

  /* Pagination Controls */
  .pagination-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
  }

  .items-per-page select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: white;
  }

  .pagination-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pagination-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #f9fafb;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-btn {
    min-width: 2.5rem;
    text-align: center;
  }

  .page-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
```

```js
// Generate sample data
  const generateTransactions = () => {
    const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare'];
    const descriptions = [
      'Grocery Store', 'Gas Station', 'Online Purchase', 'Electric Bill',
      'Movie Tickets', 'Pharmacy', 'Restaurant', 'Taxi Ride', 'Subscription'
    ];
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: `TXN-${String(i + 1).padStart(4, '0')}`,
      date: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount: Math.floor(Math.random() * 500) + 10,
      type: Math.random() > 0.3 ? 'debit' : 'credit',
      category: categories[Math.floor(Math.random() * categories.length)],
      status: Math.random() > 0.1 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'failed'
    }));
  };

  const data = generateTransactions();
  let currentPage = 1;
  let itemsPerPage = 10;
  let selectedRows = new Set();

  // Calculate total pages
  function getTotalPages() {
    return Math.ceil(data.length / itemsPerPage);
  }

  // Get paginated data
  function getPaginatedData() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }

  // Render table
  function renderTable() {
    const tbody = document.getElementById('tableBody');
    const paginatedData = getPaginatedData();
    
    tbody.innerHTML = paginatedData.map(transaction => `
      <tr class="${selectedRows.has(transaction.id) ? 'selected' : ''}">
        <td class="checkbox-col">
          <input type="checkbox" 
                 ${selectedRows.has(transaction.id) ? 'checked' : ''}
                 onchange="handleRowSelect('${transaction.id}', this.checked)">
        </td>
        <td><strong>${transaction.id}</strong></td>
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td class="numeric ${transaction.type === 'credit' ? 'amount-credit' : ''}">
          ${transaction.type === 'credit' ? '+' : '-'}$${transaction.amount.toFixed(2)}
        </td>
        <td>
          <span class="status-badge status-${transaction.status}">
            ${transaction.status}
          </span>
        </td>
      </tr>
    `).join('');
    
    updateSelectAll();
    updateSelectionSummary();
  }

  // Render pagination buttons
  function renderPagination() {
    const totalPages = getTotalPages();
    const pageButtons = document.getElementById('pageButtons');
    let html = '';
    
    // Calculate which page numbers to show
    let pages = [];
    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      pages = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      pages = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      pages = Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
    }
    
    pageButtons.innerHTML = pages.map(page => `
      <button class="pagination-btn page-btn ${page === currentPage ? 'active' : ''}"
              onclick="goToPage(${page})">
        ${page}
      </button>
    `).join('');
    
    // Update prev/next buttons
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    
    // Update results text
    document.getElementById('resultsText').textContent = `of ${data.length} results`;
  }

  // Selection handlers
  function handleSelectAll() {
    const checkbox = document.getElementById('selectAll');
    const paginatedData = getPaginatedData();
    
    if (checkbox.checked) {
      paginatedData.forEach(item => selectedRows.add(item.id));
    } else {
      paginatedData.forEach(item => selectedRows.delete(item.id));
    }
    
    renderTable();
  }

  function handleRowSelect(id, checked) {
    if (checked) {
      selectedRows.add(id);
    } else {
      selectedRows.delete(id);
    }
    
    updateSelectAll();
    updateSelectionSummary();
    updateRowStyles();
  }

  function updateSelectAll() {
    const paginatedData = getPaginatedData();
    const selectAll = document.getElementById('selectAll');
    const pageSelected = paginatedData.every(item => selectedRows.has(item.id));
    const someSelected = paginatedData.some(item => selectedRows.has(item.id));
    
    selectAll.checked = pageSelected;
    selectAll.indeterminate = !pageSelected && someSelected;
  }

  function updateSelectionSummary() {
    const summary = document.getElementById('selectionSummary');
    const text = document.getElementById('selectionText');
    
    if (selectedRows.size > 0) {
      summary.classList.remove('hidden');
      text.textContent = `${selectedRows.size} row${selectedRows.size !== 1 ? 's' : ''} selected`;
    } else {
      summary.classList.add('hidden');
    }
  }

  function updateRowStyles() {
    document.querySelectorAll('tbody tr').forEach((row, index) => {
      const paginatedData = getPaginatedData();
      if (selectedRows.has(paginatedData[index].id)) {
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });
  }

  function clearSelection() {
    selectedRows.clear();
    renderTable();
  }

  // Pagination handlers
  function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    renderTable();
    renderPagination();
  }

  function goToPage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      renderPagination();
    }
  }

  function nextPage() {
    if (currentPage < getTotalPages()) {
      currentPage++;
      renderTable();
      renderPagination();
    }
  }

  // Initial render
  renderTable();
  renderPagination();
```

## sortable

```html
<div class="table-container">
  <table id="sortableTable">
    <thead>
      <tr>
        <th class="sortable" data-column="name">
          Name
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="email">
          Email
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="role">
          Role
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="salary">
          Salary
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="status">
          Status
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
        <th class="sortable" data-column="lastLogin">
          Last Login
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
          </svg>
        </th>
      </tr>
    </thead>
    <tbody id="tableBody">
      <!-- Table rows will be rendered here -->
    </tbody>
  </table>
</div>
```

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  .table-container {
    width: 100%;
    overflow-x: auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  th:hover {
    background: #f3f4f6;
  }

  th.sortable {
    position: relative;
    padding-right: 2rem;
  }

  .sort-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  .sort-icon.asc,
  .sort-icon.desc {
    color: #3b82f6;
  }

  tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background-color 0.2s;
  }

  tbody tr:hover {
    background: #f9fafb;
  }

  td {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: #111827;
  }

  td.numeric {
    text-align: right;
    font-family: 'SF Mono', Monaco, monospace;
  }

  .status-badge {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
  }

  .status-active {
    background: #d1fae5;
    color: #065f46;
  }

  .status-inactive {
    background: #f3f4f6;
    color: #374151;
  }
```

```js
// Data
  const tableData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', salary: 95000, status: 'active', lastLogin: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', salary: 65000, status: 'active', lastLogin: '2024-01-14' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', salary: 45000, status: 'inactive', lastLogin: '2024-01-10' },
    { name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', salary: 68000, status: 'active', lastLogin: '2024-01-15' },
    { name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin', salary: 92000, status: 'active', lastLogin: '2024-01-13' },
    { name: 'Eve Wilson', email: 'eve@example.com', role: 'Editor', salary: 70000, status: 'active', lastLogin: '2024-01-16' },
    { name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', salary: 48000, status: 'inactive', lastLogin: '2024-01-08' },
  ];

  let currentSort = { column: null, direction: 'asc' };
  let data = [...tableData];

  // Render table
  function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = data.map(row => `
      <tr>
        <td><strong>${row.name}</strong></td>
        <td>${row.email}</td>
        <td>${row.role}</td>
        <td class="numeric">$${row.salary.toLocaleString()}</td>
        <td><span class="status-badge status-${row.status}">${row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span></td>
        <td>${row.lastLogin}</td>
      </tr>
    `).join('');
  }

  // Sort function
  function sortTable(column) {
    const direction = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
    
    data.sort((a, b) => {
      let aVal = a[column];
      let bVal = b[column];
      
      // Handle numeric values
      if (typeof aVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Handle strings
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    currentSort = { column, direction };
    updateSortIcons();
    renderTable();
  }

  // Update sort icons
  function updateSortIcons() {
    document.querySelectorAll('.sort-icon').forEach(icon => {
      icon.classList.remove('asc', 'desc');
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />';
    });
    
    if (currentSort.column) {
      const th = document.querySelector(`[data-column="${currentSort.column}"]`);
      const icon = th.querySelector('.sort-icon');
      icon.classList.add(currentSort.direction);
      
      if (currentSort.direction === 'asc') {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />';
      } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />';
      }
    }
  }

  // Event listeners
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.dataset.column;
      sortTable(column);
    });
  });

  // Initial render
  renderTable();
```
