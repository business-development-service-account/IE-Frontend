// Mock Data
const mockData = {
  documents: [
    {
      id: "doc1",
      name: "Employee Onboarding SOP",
      type: "SOP",
      category: "HR",
      size: "156 KB",
      uploadDate: "2025-09-08",
      status: "processed",
      content: "Standard Operating Procedure for Employee Onboarding...",
      tags: ["onboarding", "HR", "process"]
    },
    {
      id: "doc2", 
      name: "Company Vision 2025",
      type: "Vision",
      category: "Strategy",
      size: "89 KB", 
      uploadDate: "2025-09-07",
      status: "processed",
      content: "Our vision is to become the leading provider of innovative business solutions...",
      tags: ["vision", "strategy", "2025"]
    },
    {
      id: "doc3",
      name: "Customer Service Process",
      type: "Process", 
      category: "Customer Service",
      size: "234 KB",
      uploadDate: "2025-09-06", 
      status: "processing",
      content: "Customer service escalation procedures and best practices...",
      tags: ["customer", "service", "escalation"]
    }
  ],
  agents: [
    {
      id: "strategy-agent",
      name: "Strategy Analyst",
      description: "Specializes in strategic planning, vision analysis, and business development",
      enabled: true,
      specialties: ["strategy", "vision", "planning"],
      tools: ["document_search", "analysis", "reporting"],
      status: "active"
    },
    {
      id: "hr-agent", 
      name: "HR Operations Specialist",
      description: "Handles human resources processes, SOPs, and policy questions",
      enabled: true,
      specialties: ["HR", "policies", "SOPs"],
      tools: ["policy_lookup", "process_guidance", "compliance_check"],
      status: "idle"
    },
    {
      id: "operations-agent",
      name: "Operations Manager",
      description: "Manages operational processes, workflow optimization, and efficiency analysis",
      enabled: false,
      specialties: ["operations", "workflows", "optimization"],
      tools: ["process_analysis", "workflow_design", "efficiency_metrics"],
      status: "disabled"
    }
  ],
  apiProviders: [
    {
      name: "OpenAI",
      models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
      status: "disconnected",
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    },
    {
      name: "Anthropic", 
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      status: "disconnected",
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    },
    {
      name: "Google",
      models: ["gemini-1.5-pro", "gemini-1.0-pro"], 
      status: "disconnected",
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    },
    {
      name: "xAI",
      models: ["grok-beta"],
      status: "disconnected", 
      apiKey: "",
      usage: { requests: 0, tokens: 0, cost: 0 }
    }
  ],
  conversations: [],
  systemStats: {
    documentsProcessed: 15,
    totalQueries: 47,
    activeAgents: 2,
    successRate: 94.5,
    averageResponseTime: "2.3s",
    knowledgeBaseSizeMB: 150
  }
};

// Application State
let appState = {
  currentTab: 'dashboard',
  isProcessing: false,
  currentConversation: [],
  agentActivity: {
    planning: { active: false, progress: 0, content: "Waiting for query..." },
    execution: { active: false, progress: 0, content: "Waiting for execution..." }
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure DOM is fully loaded
  setTimeout(() => {
    initializeApp();
  }, 100);
});

function initializeApp() {
  setupNavigation();
  setupFileUpload();
  setupChat();
  renderDashboard();
  renderDocuments();
  renderAgentMonitor();
  
  // Delay these to ensure elements are available
  setTimeout(() => {
    setupApiSettings();
    setupAgentConfiguration();
    renderAnalytics();
  }, 200);
  
  // Add some initial activity
  addActivityItem('System started successfully', 'system');
  addActivityItem('Knowledge base loaded', 'database');
}

// Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  if (navItems.length === 0) {
    console.warn('Navigation items not found, retrying...');
    setTimeout(setupNavigation, 200);
    return;
  }
  
  navItems.forEach(item => {
    // Remove any existing listeners
    item.removeEventListener('click', handleNavClick);
    // Add new listener
    item.addEventListener('click', handleNavClick);
  });
}

function handleNavClick(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const item = event.currentTarget;
  const tabName = item.dataset.tab;
  
  if (!tabName) {
    console.error('Tab name not found on navigation item');
    return;
  }
  
  console.log('Switching to tab:', tabName);
  switchTab(tabName);
  
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
  item.classList.add('active');
}

function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  const targetTab = document.getElementById(`${tabName}-tab`);
  if (targetTab) {
    targetTab.classList.add('active');
    appState.currentTab = tabName;
    
    // Trigger specific tab initialization if needed
    if (tabName === 'analytics') {
      setTimeout(renderAnalytics, 100);
    } else if (tabName === 'agents') {
      setTimeout(renderAgentConfiguration, 100);
    } else if (tabName === 'api') {
      setTimeout(renderApiSettings, 100);
    }
  } else {
    console.error('Target tab not found:', `${tabName}-tab`);
  }
}

// Dashboard
function renderDashboard() {
  updateSystemStats();
  renderRecentActivity();
}

function updateSystemStats() {
  const stats = mockData.systemStats;
  const docsElement = document.getElementById('docs-processed');
  const queriesElement = document.getElementById('total-queries');
  const agentsElement = document.getElementById('active-agents');
  const rateElement = document.getElementById('success-rate');
  
  if (docsElement) docsElement.textContent = stats.documentsProcessed;
  if (queriesElement) queriesElement.textContent = stats.totalQueries;
  if (agentsElement) agentsElement.textContent = stats.activeAgents;
  if (rateElement) rateElement.textContent = `${stats.successRate}%`;
}

function renderRecentActivity() {
  const activityList = document.getElementById('activity-list');
  // Activity items are added dynamically through addActivityItem()
}

function addActivityItem(message, type) {
  const activityList = document.getElementById('activity-list');
  if (!activityList) return;
  
  const iconClass = getActivityIcon(type);
  const time = new Date().toLocaleTimeString();
  
  const activityItem = document.createElement('div');
  activityItem.className = 'activity-item';
  activityItem.innerHTML = `
    <div class="activity-icon">
      <i class="${iconClass}"></i>
    </div>
    <div class="activity-content">
      <p>${message}</p>
      <div class="activity-time">${time}</div>
    </div>
  `;
  
  activityList.insertBefore(activityItem, activityList.firstChild);
  
  // Keep only the last 5 items
  if (activityList.children.length > 5) {
    activityList.removeChild(activityList.lastChild);
  }
}

function getActivityIcon(type) {
  const icons = {
    system: 'fas fa-cog',
    database: 'fas fa-database',
    chat: 'fas fa-comment',
    upload: 'fas fa-upload',
    agent: 'fas fa-robot',
    api: 'fas fa-key'
  };
  return icons[type] || 'fas fa-info-circle';
}

// File Upload
function setupFileUpload() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const browseButton = document.getElementById('browse-files');

  if (!uploadArea || !fileInput || !browseButton) return;

  browseButton.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
  });

  uploadArea.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFileUpload(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => {
    handleFileUpload(e.target.files);
  });
}

function handleFileUpload(files) {
  Array.from(files).forEach(file => {
    simulateFileUpload(file);
  });
}

function simulateFileUpload(file) {
  const newDoc = {
    id: `doc${Date.now()}`,
    name: file.name,
    type: getFileType(file.name),
    category: "General",
    size: formatFileSize(file.size),
    uploadDate: new Date().toISOString().split('T')[0],
    status: "processing",
    content: "Processing document content...",
    tags: ["uploaded", "new"]
  };

  mockData.documents.push(newDoc);
  renderDocuments();
  addActivityItem(`Uploaded ${file.name}`, 'upload');

  // Simulate processing completion
  setTimeout(() => {
    newDoc.status = "processed";
    newDoc.content = "Document content processed and indexed.";
    renderDocuments();
    addActivityItem(`Processed ${file.name}`, 'database');
    mockData.systemStats.documentsProcessed++;
    updateSystemStats();
  }, 2000 + Math.random() * 3000);
}

function getFileType(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  const typeMap = {
    'pdf': 'PDF',
    'docx': 'DOCX', 
    'doc': 'DOC',
    'txt': 'TXT',
    'md': 'Markdown'
  };
  return typeMap[extension] || 'Unknown';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Documents
function renderDocuments() {
  const documentsGrid = document.getElementById('documents-grid');
  if (!documentsGrid) return;
  
  documentsGrid.innerHTML = '';

  const filteredDocs = filterDocuments();

  filteredDocs.forEach(doc => {
    const docCard = createDocumentCard(doc);
    documentsGrid.appendChild(docCard);
  });
  
  // Setup filters after rendering
  setupDocumentFilters();
}

function setupDocumentFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');
  
  if (categoryFilter) {
    categoryFilter.removeEventListener('change', renderDocuments);
    categoryFilter.addEventListener('change', renderDocuments);
  }
  
  if (statusFilter) {
    statusFilter.removeEventListener('change', renderDocuments);
    statusFilter.addEventListener('change', renderDocuments);
  }
}

function filterDocuments() {
  const categoryFilter = document.getElementById('category-filter')?.value || '';
  const statusFilter = document.getElementById('status-filter')?.value || '';

  return mockData.documents.filter(doc => {
    return (categoryFilter === '' || doc.category === categoryFilter) &&
           (statusFilter === '' || doc.status === statusFilter);
  });
}

function createDocumentCard(doc) {
  const card = document.createElement('div');
  card.className = 'document-card';
  
  const statusClass = doc.status === 'processed' ? 'success' : 
                     doc.status === 'processing' ? 'warning' : 'info';
  
  card.innerHTML = `
    <div class="document-header">
      <div class="document-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <div class="status status--${statusClass}">
        ${doc.status}
      </div>
    </div>
    <div class="document-name">${doc.name}</div>
    <div class="document-meta">
      ${doc.type} • ${doc.size} • ${doc.category}
    </div>
    <div class="document-tags">
      ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  `;
  
  return card;
}

// Chat System
function setupChat() {
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-message');

  if (!chatInput || !sendButton) return;

  sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
      sendMessage(message);
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        sendMessage(message);
        chatInput.value = '';
      }
    }
  });
}

function sendMessage(message) {
  if (appState.isProcessing) return;

  // Add user message
  addMessageToChat('user', message);
  appState.isProcessing = true;

  // Update agent monitor
  updateMonitorStatus('active');
  
  // Start planning phase
  startPlanningPhase(message);

  addActivityItem('New query received', 'chat');
  mockData.systemStats.totalQueries++;
  updateSystemStats();
}

function addMessageToChat(type, content, stage = null, agent = null) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;
  
  // Remove welcome message if present
  const welcomeMessage = chatMessages.querySelector('.welcome-message');
  if (welcomeMessage) {
    welcomeMessage.remove();
  }

  const message = document.createElement('div');
  message.className = `message ${type}`;

  const avatar = type === 'user' ? 
    '<i class="fas fa-user"></i>' : 
    '<i class="fas fa-robot"></i>';

  let stageLabel = '';
  if (stage) {
    stageLabel = `<div class="message-stage">${stage} - ${agent}</div>`;
  }

  message.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      ${stageLabel}
      <p>${content}</p>
    </div>
  `;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startPlanningPhase(query) {
  updateAgentStage('planning', true, 0, 'Analyzing query and determining approach...');
  
  let progress = 0;
  const planningInterval = setInterval(() => {
    progress += 20;
    
    let content;
    if (progress === 20) content = 'Parsing query intent...';
    else if (progress === 40) content = 'Searching knowledge base...';
    else if (progress === 60) content = 'Selecting relevant agents...';
    else if (progress === 80) content = 'Preparing execution plan...';
    else if (progress === 100) content = 'Planning complete. Starting execution...';
    
    updateAgentStage('planning', true, progress, content);
    
    if (progress >= 100) {
      clearInterval(planningInterval);
      
      // Add planning message to chat
      addMessageToChat('agent', content, 'Planning', 'Strategy Analyst');
      
      // Start execution phase
      setTimeout(() => startExecutionPhase(query), 500);
    }
  }, 300);
}

function startExecutionPhase(query) {
  updateAgentStage('execution', true, 0, 'Retrieving relevant documents...');
  
  let progress = 0;
  const executionInterval = setInterval(() => {
    progress += 25;
    
    let content;
    if (progress === 25) content = 'Found 3 relevant documents...';
    else if (progress === 50) content = 'Extracting key information...';
    else if (progress === 75) content = 'Analyzing content and context...';
    else if (progress === 100) content = 'Generating comprehensive response...';
    
    updateAgentStage('execution', true, progress, content);
    
    if (progress >= 100) {
      clearInterval(executionInterval);
      
      // Add execution message to chat
      addMessageToChat('agent', content, 'Execution', 'Strategy Analyst');
      
      // Generate final response
      setTimeout(() => generateResponse(query), 1000);
    }
  }, 400);
}

function generateResponse(query) {
  const responses = {
    vision: "Based on our Company Vision 2025 document, our vision is to become the leading provider of innovative business solutions that empower organizations to achieve sustainable growth and digital transformation. Key focus areas include customer-centric innovation, operational excellence, and strategic partnerships.",
    onboarding: "According to our Employee Onboarding SOP, the process includes: 1) Pre-boarding preparation, 2) First day orientation, 3) Department-specific training, 4) 30-60-90 day check-ins, and 5) Performance evaluation. The complete process takes approximately 90 days.",
    customer: "Our Customer Service Process emphasizes escalation procedures with three tiers: Level 1 (front-line support), Level 2 (technical specialists), and Level 3 (senior management). Response times are 2 hours for critical, 24 hours for high priority, and 72 hours for standard issues.",
    default: "I've analyzed your query against our knowledge base. Based on the available documents including SOPs, vision statements, and process documentation, I can provide comprehensive guidance on your business operations. Would you like me to elaborate on any specific aspect?"
  };

  let response = responses.default;
  
  if (query.toLowerCase().includes('vision')) response = responses.vision;
  else if (query.toLowerCase().includes('onboarding')) response = responses.onboarding;
  else if (query.toLowerCase().includes('customer')) response = responses.customer;

  // Add final response to chat
  addMessageToChat('agent', response, 'Response', 'Strategy Analyst');

  // Reset agent monitor
  updateMonitorStatus('idle');
  updateAgentStage('planning', false, 0, 'Waiting for query...');
  updateAgentStage('execution', false, 0, 'Waiting for execution...');
  
  appState.isProcessing = false;
  addActivityItem('Query processed successfully', 'agent');
}

function updateAgentStage(stage, active, progress, content) {
  appState.agentActivity[stage] = { active, progress, content };
  
  const stageElement = document.getElementById(`${stage}-content`);
  const progressElement = document.getElementById(`${stage}-progress`);
  
  if (stageElement) {
    stageElement.innerHTML = active ? 
      `<p>${content}</p>` : 
      `<p class="stage-idle">${content}</p>`;
  }
  
  if (progressElement) {
    const fill = progressElement.querySelector('.progress-fill');
    if (fill) fill.style.width = `${progress}%`;
  }
}

function updateMonitorStatus(status) {
  const statusElement = document.getElementById('monitor-status');
  if (statusElement) {
    statusElement.textContent = status === 'active' ? 'Processing' : 'Idle';
    statusElement.className = `monitor-status ${status}`;
  }
}

function renderAgentMonitor() {
  const agentsList = document.getElementById('agents-list');
  if (!agentsList) return;
  
  const activeAgents = mockData.agents.filter(agent => agent.enabled);
  
  agentsList.innerHTML = activeAgents.map(agent => `
    <div class="agent-item">
      <div class="agent-name">${agent.name}</div>
      <div class="agent-status">${agent.status}</div>
    </div>
  `).join('');
}

// Agent Configuration
function setupAgentConfiguration() {
  renderAgentConfiguration();
}

function renderAgentConfiguration() {
  const agentsGrid = document.getElementById('agents-config-grid');
  if (!agentsGrid) return;

  agentsGrid.innerHTML = mockData.agents.map(agent => `
    <div class="agent-config-card">
      <div class="agent-config-header">
        <div>
          <div class="agent-config-name">${agent.name}</div>
          <div class="agent-config-description">${agent.description}</div>
        </div>
        <button class="agent-toggle ${agent.enabled ? 'enabled' : ''}" onclick="toggleAgent('${agent.id}')">
          <i class="fas ${agent.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
        </button>
      </div>
      <div class="agent-specialties">
        <h5>Specialties</h5>
        <div class="specialty-tags">
          ${agent.specialties.map(specialty => `<span class="tag">${specialty}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function toggleAgent(agentId) {
  const agent = mockData.agents.find(a => a.id === agentId);
  if (agent) {
    agent.enabled = !agent.enabled;
    agent.status = agent.enabled ? 'idle' : 'disabled';
    renderAgentConfiguration();
    renderAgentMonitor();
    
    const activeCount = mockData.agents.filter(a => a.enabled).length;
    mockData.systemStats.activeAgents = activeCount;
    updateSystemStats();
    
    addActivityItem(`${agent.enabled ? 'Enabled' : 'Disabled'} ${agent.name}`, 'agent');
  }
}

// API Settings
function setupApiSettings() {
  renderApiSettings();
}

function renderApiSettings() {
  const apiProviders = document.getElementById('api-providers');
  if (!apiProviders) return;

  apiProviders.innerHTML = mockData.apiProviders.map(provider => `
    <div class="api-provider">
      <div class="provider-header">
        <div class="provider-name">${provider.name}</div>
        <div class="provider-status ${provider.status}">${provider.status}</div>
      </div>
      <div class="provider-config">
        <div class="form-group">
          <label class="form-label">API Key</label>
          <input 
            type="password" 
            class="form-control" 
            placeholder="Enter your ${provider.name} API key"
            data-provider="${provider.name.toLowerCase()}"
            onchange="updateApiKey('${provider.name}', this.value)"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Model</label>
          <select class="form-control">
            ${provider.models.map(model => `<option value="${model}">${model}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="provider-actions">
        <button class="btn btn--outline" onclick="testConnection('${provider.name}')">
          Test Connection
        </button>
        <button class="btn btn--secondary">
          View Usage
        </button>
      </div>
    </div>
  `).join('');
}

function updateApiKey(providerName, apiKey) {
  const provider = mockData.apiProviders.find(p => p.name === providerName);
  if (provider) {
    provider.apiKey = apiKey;
    provider.status = apiKey ? 'connected' : 'disconnected';
    renderApiSettings();
    addActivityItem(`Updated ${providerName} API key`, 'api');
  }
}

function testConnection(providerName) {
  const provider = mockData.apiProviders.find(p => p.name === providerName);
  if (provider && provider.apiKey) {
    addActivityItem(`Testing ${providerName} connection...`, 'api');
    
    // Simulate connection test
    setTimeout(() => {
      provider.status = 'connected';
      renderApiSettings();
      addActivityItem(`${providerName} connection successful`, 'api');
    }, 1500);
  } else {
    addActivityItem(`${providerName} API key required for connection test`, 'api');
  }
}

// Analytics
function renderAnalytics() {
  const queryChart = document.getElementById('query-chart');
  const performanceChart = document.getElementById('performance-chart');
  
  if (!queryChart || !performanceChart) {
    setTimeout(renderAnalytics, 200);
    return;
  }
  
  renderQueryChart();
  renderPerformanceChart();
}

function renderQueryChart() {
  const ctx = document.getElementById('query-chart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Strategic Planning', 'HR Operations', 'Customer Service', 'General Queries'],
      datasets: [{
        data: [12, 19, 8, 8],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
}

function renderPerformanceChart() {
  const ctx = document.getElementById('performance-chart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Strategy Analyst', 'HR Specialist', 'Operations Mgr'],
      datasets: [{
        label: 'Success Rate (%)',
        data: [96, 94, 92],
        backgroundColor: ['#5D878F', '#DB4545', '#D2BA4C'],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Make functions globally available
window.toggleAgent = toggleAgent;
window.updateApiKey = updateApiKey;
window.testConnection = testConnection;