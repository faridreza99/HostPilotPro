// Fast dashboard API endpoints optimized for performance
import { Express } from 'express';
import { isDemoAuthenticated } from './demoAuth';

export function registerFastDashboardRoutes(app: Express) {

  // Fast tasks endpoint for dashboard - only recent tasks
  app.get('/api/dashboard/recent-tasks', isDemoAuthenticated, async (req: any, res) => {
    try {
      const organizationId = req.user.organizationId || "default-org";
      const { storage } = await import('./storage');
      
      const allTasks = await storage.getTasks();
      
      // Filter by organization and get only recent 10 tasks
      const filteredTasks = allTasks
        .filter(task => task.organizationId === organizationId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
      
      res.json(filteredTasks);
    } catch (error) {
      console.error("Error fetching recent tasks:", error);
      res.status(500).json({ message: "Failed to fetch recent tasks" });
    }
  });

  // Fast task stats endpoint for dashboard
  app.get('/api/dashboard/task-stats', isDemoAuthenticated, async (req: any, res) => {
    try {
      const organizationId = req.user.organizationId || "default-org";
      const { storage } = await import('./storage');
      
      const allTasks = await storage.getTasks();
      const orgTasks = allTasks.filter(task => task.organizationId === organizationId);
      
      const stats = {
        total: orgTasks.length,
        pending: orgTasks.filter(t => t.status === 'pending').length,
        inProgress: orgTasks.filter(t => t.status === 'in-progress').length,
        completed: orgTasks.filter(t => t.status === 'completed').length,
        highPriority: orgTasks.filter(t => t.priority === 'high').length,
        overdue: orgTasks.filter(t => {
          if (!t.dueDate) return false;
          return new Date(t.dueDate) < new Date();
        }).length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching task stats:", error);
      res.status(500).json({ message: "Failed to fetch task stats" });
    }
  });

  // Finance export endpoints - moved here to ensure they're registered before Vite middleware
  app.post('/api/finance-export', isDemoAuthenticated, async (req: any, res) => {
    console.log(`🚀 Finance export endpoint called`);
    console.log(`📋 Request body:`, req.body);
    console.log(`👤 User:`, req.user ? { id: req.user.id, organizationId: req.user.organizationId } : 'No user');
    
    try {
      if (!req.user) {
        console.error(`❌ No user found in request`);
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { organizationId, id: userId } = req.user;
      const { exportType, format, dateRange, filters } = req.body;
      
      console.log(`📋 Finance export requested: ${exportType} format by user ${userId} for org ${organizationId}`);
      
      if (!exportType) {
        console.error(`❌ No export type specified`);
        return res.status(400).json({ error: 'Export type is required' });
      }

      // Get financial data with detailed logging
      console.log(`🔍 Fetching financial data...`);
      const { storage } = await import('./storage');
      const finances = await storage.getFinances();
      console.log(`💰 Retrieved ${finances.length} total finance records`);
      
      const organizationFinances = finances.filter(f => 
        f.organizationId === organizationId || 
        f.organizationId === 'default-org' || 
        f.organizationId === 'demo-org'
      );
      
      console.log(`📊 Found ${organizationFinances.length} financial records for export after filtering`);
      
      if (exportType === 'csv') {
        console.log(`📝 Generating CSV export...`);
        
        // Generate Excel-compatible CSV content with proper escaping
        const csvHeaders = ['Date', 'Type', 'Amount', 'Category', 'Description', 'Property', 'Status', 'Transaction ID'];
        
        const csvRows = organizationFinances.map(f => {
          // Escape special characters for Excel compatibility
          const escapeCSVField = (field: any) => {
            if (field === null || field === undefined) return '';
            const str = String(field);
            // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
            if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          };
          
          return [
            escapeCSVField(f.date || new Date().toISOString().split('T')[0]),
            escapeCSVField((f.type || 'income').toUpperCase()),
            escapeCSVField(f.amount || '0'),
            escapeCSVField(f.category || 'General'),
            escapeCSVField(f.description || 'Transaction'),
            escapeCSVField(f.propertyName || 'General'),
            escapeCSVField(f.status || 'confirmed'),
            escapeCSVField(f.id || '')
          ];
        });
        
        // Add BOM for Excel UTF-8 compatibility
        const BOM = '\uFEFF';
        const csvContent = BOM + [
          csvHeaders.join(','),
          ...csvRows.map(row => row.join(','))
        ].join('\r\n'); // Use Windows line endings for Excel compatibility
        
        // Set proper headers for CSV download
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="financial_export.csv"');
        res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8').toString());
        res.send(csvContent);
        
        console.log(`✅ CSV export completed: ${csvContent.length} characters, ${csvRows.length} data rows`);
        
      } else if (exportType === 'pdf') {
        // Calculate summary statistics
        const totalRevenue = organizationFinances
          .filter(f => f.type === 'income')
          .reduce((sum, f) => sum + (parseFloat(f.amount?.toString() || '0') || 0), 0);
          
        const totalExpenses = organizationFinances
          .filter(f => f.type === 'expense')
          .reduce((sum, f) => sum + (parseFloat(f.amount?.toString() || '0') || 0), 0);
        
        // Create a simple HTML-to-PDF content that browsers can print to PDF
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Financial Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; border-bottom: 2px solid #ccc; }
        h2 { color: #666; margin-top: 30px; }
        .summary { background: #f5f5f5; padding: 20px; margin: 20px 0; }
        .transaction { margin: 5px 0; padding: 8px; border-bottom: 1px solid #eee; }
        .income { color: green; }
        .expense { color: red; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <h1>Financial Report</h1>
    <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
    <p><strong>Organization:</strong> ${organizationId}</p>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Revenue:</strong> ฿${totalRevenue.toLocaleString()}</p>
        <p><strong>Total Expenses:</strong> ฿${totalExpenses.toLocaleString()}</p>
        <p><strong>Net Profit:</strong> ฿${(totalRevenue - totalExpenses).toLocaleString()}</p>
        <p><strong>Total Transactions:</strong> ${organizationFinances.length}</p>
    </div>
    
    <h2>Recent Transactions</h2>
    ${organizationFinances.slice(0, 20).map(transaction => `
        <div class="transaction ${transaction.type}">
            <strong>${transaction.date || 'N/A'}</strong> | 
            <span class="${transaction.type}">${(transaction.type || 'income').toUpperCase()}</span> | 
            <strong>฿${transaction.amount || '0'}</strong> | 
            ${transaction.category || 'General'}
            ${transaction.description ? ` - ${transaction.description}` : ''}
        </div>
    `).join('')}
    
    ${organizationFinances.length > 20 ? `<p><em>... and ${organizationFinances.length - 20} more transactions</em></p>` : ''}
    
    <div style="margin-top: 40px; font-size: 12px; color: #666;">
        <p>Report generated by HostPilotPro Financial Management System</p>
        <p>To save as PDF: Use your browser's Print function and select "Save as PDF"</p>
    </div>
</body>
</html>`;
        
        // Set proper headers for HTML download that can be printed to PDF
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="financial_report.html"');
        res.send(htmlContent);
        
        console.log(`✅ HTML export completed: ${htmlContent.length} characters (can be printed to PDF)`);
        
      } else {
        res.status(400).json({ message: "Unsupported export type" });
      }
      
    } catch (error) {
      console.error("❌ Error exporting financial data:", error);
      res.status(500).json({ message: "Failed to export financial data" });
    }
  });
}