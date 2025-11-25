import * as XLSX from 'xlsx';

/**
 * Export email subscriptions to Excel file
 * @param {Array} data - Array of email subscription objects
 * @param {string} filename - Output filename (without extension)
 */
export const exportToExcel = (data, filename = 'email_subscriptions') => {
  try {
    // Format data for Excel
    const formattedData = data.map((item, index) => ({
      '#': index + 1,
      'Email': item.email,
      'Fuente': item.source || 'N/A',
      'Fecha': new Date(item.created_at).toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      'IP': item.ip_address || 'N/A',
      'Navegador': item.user_agent ?
        (item.user_agent.includes('Chrome') ? 'Chrome' :
         item.user_agent.includes('Safari') ? 'Safari' :
         item.user_agent.includes('Firefox') ? 'Firefox' :
         item.user_agent.includes('Edge') ? 'Edge' : 'Otro') : 'N/A'
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // #
      { wch: 35 }, // Email
      { wch: 15 }, // Fuente
      { wch: 20 }, // Fecha
      { wch: 15 }, // IP
      { wch: 15 }  // Navegador
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Suscripciones');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}_${date}.xlsx`;

    // Write file
    XLSX.writeFile(wb, fullFilename);

    return { success: true, filename: fullFilename };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, error: error.message };
  }
};