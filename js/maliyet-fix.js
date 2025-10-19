document.addEventListener('DOMContentLoaded', function() {
  // Kategori Bazında Kar Marjı grafikleri için hover efekti
  const karBars = document.querySelectorAll('.kar-bar');
  if(karBars) {
    karBars.forEach(bar => {
      bar.addEventListener('mouseenter', () => {
        bar.style.opacity = '0.8';
        bar.style.transform = 'scaleY(1.1)';
      });
      
      bar.addEventListener('mouseleave', () => {
        bar.style.opacity = '1';
        bar.style.transform = 'scaleY(1)';
      });
    });
  }
  
  // Maliyet Tablosu için satır hover efekti
  const tableRows = document.querySelectorAll('.cost-table tbody tr');
  if(tableRows) {
    tableRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = 'rgba(248, 244, 241, 0.2)';
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = '';
      });
    });
  }
  
  // Mobil uyumluluk için tablo genişliğini ayarlama
  function adjustTableWidth() {
    const tables = document.querySelectorAll('.cost-table');
    const containerWidths = document.querySelectorAll('.cost-table-container').forEach((container, index) => {
      const containerWidth = container.offsetWidth;
      const table = tables[index];
      
      if (table && containerWidth < 800) {
        table.style.minWidth = '800px'; // Minimum tablo genişliği
      } else if (table) {
        table.style.minWidth = 'auto';
      }
    });
  }
  
  // Sayfa yüklendiğinde ve pencere boyutu değiştiğinde tabloları ayarla
  adjustTableWidth();
  window.addEventListener('resize', adjustTableWidth);
  
  // Maliyet Dağılımı pasta grafiği animasyonu
  const pieSegments = document.querySelectorAll('.maliyet-segment');
  if(pieSegments) {
    setTimeout(() => {
      pieSegments.forEach((segment, index) => {
        segment.style.transition = 'transform 0.5s ease';
        segment.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
          segment.style.transform = 'scale(1)';
        }, 300 + (index * 100));
      });
    }, 500);
  }
});