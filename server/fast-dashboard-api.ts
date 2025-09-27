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
            escapeCSVField(f.propertyId ? `Property ${f.propertyId}` : 'General'),
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
        console.log(`📄 Generating PDF export...`);
        
        // Calculate summary statistics
        const totalRevenue = organizationFinances
          .filter(f => f.type === 'income')
          .reduce((sum, f) => sum + (parseFloat(f.amount?.toString() || '0') || 0), 0);
          
        const totalExpenses = organizationFinances
          .filter(f => f.type === 'expense')
          .reduce((sum, f) => sum + (parseFloat(f.amount?.toString() || '0') || 0), 0);
        
        const netProfit = totalRevenue - totalExpenses;
        
        // Import PDFKit dynamically
        const PDFDocument = (await import('pdfkit')).default;
        
        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="financial_report.pdf"');
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Add content to PDF
        doc.fontSize(20).font('Helvetica-Bold').text('Financial Report', { align: 'center' });
        doc.moveDown(0.5);
        
        // Add metadata
        doc.fontSize(12).font('Helvetica')
          .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'left' })
          .text(`Organization: ${organizationId}`)
          .moveDown(1);
        
        // Add summary section
        doc.fontSize(16).font('Helvetica-Bold').text('Summary');
        doc.moveDown(0.5);
        
        doc.fontSize(12).font('Helvetica')
          .fillColor('#22c55e').text(`Total Revenue: ฿${totalRevenue.toLocaleString()}`)
          .fillColor('#ef4444').text(`Total Expenses: ฿${totalExpenses.toLocaleString()}`)
          .fillColor(netProfit >= 0 ? '#22c55e' : '#ef4444')
          .text(`Net Profit: ฿${netProfit.toLocaleString()}`)
          .fillColor('#000000')
          .text(`Total Transactions: ${organizationFinances.length}`)
          .moveDown(1);
        
        // Add transactions section
        doc.fontSize(16).font('Helvetica-Bold').text('Recent Transactions');
        doc.moveDown(0.5);
        
        // Add table headers
        const startY = doc.y;
        const colWidths = [80, 60, 80, 100, 200];
        const headers = ['Date', 'Type', 'Amount', 'Category', 'Description'];
        
        let currentX = doc.page.margins.left;
        headers.forEach((header, i) => {
          doc.fontSize(10).font('Helvetica-Bold').text(header, currentX, startY, { width: colWidths[i] });
          currentX += colWidths[i];
        });
        
        doc.moveTo(doc.page.margins.left, startY + 15)
          .lineTo(doc.page.width - doc.page.margins.right, startY + 15)
          .stroke();
        
        // Add transaction rows (limit to 25 for PDF)
        const maxTransactions = Math.min(25, organizationFinances.length);
        let rowY = startY + 25;
        
        for (let i = 0; i < maxTransactions; i++) {
          const transaction = organizationFinances[i];
          currentX = doc.page.margins.left;
          
          // Check if we need a new page
          if (rowY > doc.page.height - 100) {
            doc.addPage();
            rowY = doc.page.margins.top;
          }
          
          const rowData = [
            transaction.date || 'N/A',
            (transaction.type || 'income').toUpperCase(),
            `฿${transaction.amount || '0'}`,
            transaction.category || 'General',
            (transaction.description || 'Transaction').substring(0, 30) + 
              (transaction.description && transaction.description.length > 30 ? '...' : '')
          ];
          
          rowData.forEach((data, j) => {
            const color = j === 1 ? (transaction.type === 'income' ? '#22c55e' : '#ef4444') : '#000000';
            doc.fontSize(9).font('Helvetica').fillColor(color)
              .text(data, currentX, rowY, { width: colWidths[j] });
            currentX += colWidths[j];
          });
          
          rowY += 20;
        }
        
        // Add footer if more transactions exist
        if (organizationFinances.length > maxTransactions) {
          doc.fillColor('#666666').fontSize(10)
            .text(`... and ${organizationFinances.length - maxTransactions} more transactions`, 
                  doc.page.margins.left, rowY + 10);
        }
        
        // Add footer
        doc.fillColor('#999999').fontSize(8)
          .text('Report generated by HostPilotPro Financial Management System', 
                doc.page.margins.left, doc.page.height - 50);
        
        // Finalize PDF
        doc.end();
        
        console.log(`✅ PDF export completed: ${organizationFinances.length} transactions processed`);
        
      } else {
        res.status(400).json({ message: "Unsupported export type" });
      }
      
    } catch (error) {
      console.error("❌ Error exporting financial data:", error);
      res.status(500).json({ message: "Failed to export financial data" });
    }
  });
}