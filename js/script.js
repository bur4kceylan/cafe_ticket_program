// DOM'un (Sayfa içeriğinin) tamamen yüklendiğinden emin olmak için bir olay dinleyici ekliyoruz.
// Bu, kodumuzun HTML elementleri hazır olmadan çalışmasını engeller.
document.addEventListener('DOMContentLoaded', () => {

    // --- GEREKLİ HTML ELEMENTLERİNİ DEĞİŞKENLERE ATAMA ---
    const menuBtn = document.querySelector('#menu-btn');
    const closeBtn = document.querySelector('#close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const body = document.body;
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const mainViews = document.querySelectorAll('.main-wrapper > .view');
    const pageTitleText = document.getElementById('page-title-text');
    const headerActions = document.getElementById('header-actions');

    // --- SIDEBAR (KENAR ÇUBUĞU) FONKSİYONLARI ---

    // Sidebar'ı açan fonksiyon
    const openSidebar = () => {
        sidebar?.classList.add('active'); // Sidebar'a 'active' class'ı ekleyerek görünür yapar (CSS'te tanımlı)
        overlay?.classList.add('active'); // Arka plan karartma katmanını aktif eder
        body.classList.add('sidebar-active'); // Sayfanın kaydırılmasını engeller
    };

    // Sidebar'ı kapatan fonksiyon
    const closeSidebar = () => {
        sidebar?.classList.remove('active'); // Sidebar'ın 'active' class'ını kaldırır
        overlay?.classList.remove('active'); // Arka plan katmanını gizler
        body.classList.remove('sidebar-active'); // Sayfanın tekrar kaydırılabilir olmasını sağlar
    };

    // Butonlara tıklama olaylarını atama
    menuBtn?.addEventListener('click', openSidebar);
    closeBtn?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar); // Dışarıya tıklayınca kapatma
    
    // --- ÜST BİLGİ (HEADER) İÇERİĞİNİ DİNAMİK OLARAK GÜNCELLEME ---
    const updateHeader = (targetId, linkElement) => {
        // Tıklanan linkin metnini alarak sayfa başlığını güncelle
        // Alt menü linkleri için metni doğrudan al, ana menü için span içinden al
        const pageName = linkElement.querySelector('span')?.textContent || linkElement.textContent ||'Ana Panel';
        pageTitleText.textContent = pageName;
        
        // Header'daki mevcut butonları temizle
        headerActions.innerHTML = '';
        
        if (targetId === '#tables-view') {
            // "Bölgeler ve Masalar" ekranı için özel butonlar oluştur
            const btn1 = document.createElement('a');
            btn1.href = '#';
            btn1.className = 'btn premium-btn';
            btn1.innerHTML = '<i class="fas fa-plus"></i> Yeni Masa Ekle';
            btn1.id = 'add-table-btn';
            
            const btn2 = document.createElement('a');
            btn2.href = '#';
            btn2.className = 'btn premium-btn alt';
            btn2.innerHTML = '<i class="fas fa-edit"></i> Bölgeyi Düzenle';
            btn2.id = 'edit-region-btn';

            headerActions.appendChild(btn1);
            headerActions.appendChild(btn2);
            
            // Butonlara tıklama olaylarını ekle
            btn1.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(document.querySelector('#add-table-modal'));
            });
            
            btn2.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(document.querySelector('#edit-region-modal'));
            });
        } else if (targetId === '#menu-editor-view') {
            // "Menü Düzenleyici" ekranı için özel buton
            const btn1 = document.createElement('a');
            btn1.href = '#';
            btn1.className = 'btn premium-btn';
            btn1.innerHTML = '<i class="fas fa-save"></i> Değişiklikleri Kaydet';
            headerActions.appendChild(btn1);
        }
        else {
            // Diğer tüm ekranlar için varsayılan butonu oluştur
            const defaultBtn = document.createElement('a');
            defaultBtn.href = '#';
            defaultBtn.className = 'btn';
            defaultBtn.textContent = 'Book a Table';
            headerActions.appendChild(defaultBtn);
        }
    };


    // --- SAYFA/BÖLÜM GÖRÜNÜM YÖNETİMİ (GÜNCELLENDİ) ---
    sidebarLinks.forEach(link => {
        link.onclick = (e) => {
            const targetId = link.getAttribute('href');
            const parentLi = link.closest('li'); // En yakın li elementini bul
            const isSubmenuLink = parentLi.parentElement.classList.contains('submenu');

            // Eğer link bir alt menü başlığı ise (# href'i varsa)
            if (targetId === '#') {
                e.preventDefault();
                const hasSubmenu = parentLi.classList.contains('has-submenu');
                if (hasSubmenu) {
                     // Zaten açıksa kapat, kapalıysa diğerlerini kapatıp bunu aç
                    if (parentLi.classList.contains('open')) {
                        parentLi.classList.remove('open');
                    } else {
                        document.querySelectorAll('.sidebar-nav li.open').forEach(item => item.classList.remove('open'));
                        parentLi.classList.add('open');
                    }
                }
                return; // Fonksiyonun devamını çalıştırma
            }

            // Eğer link sayfa içi bir hedefe gidiyorsa (# ile başlıyorsa)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                // Tüm ana görünümleri gizle
                mainViews.forEach(view => {
                    view.classList.add('view-hidden');
                });

                // Sadece hedef görünümü göster
                const targetView = document.querySelector(targetId);
                targetView?.classList.remove('view-hidden');
                                
                // Header içeriğini tıklanan bölüme göre güncelle
                updateHeader(targetId, link);

                // Aktif menü öğesini güncelle
                document.querySelector('.sidebar-nav li.active')?.classList.remove('active');
                if(!isSubmenuLink){
                    parentLi.classList.add('active');
                }
               
                // Mobil cihazlarda menüye tıklandıktan sonra sidebar'ı kapat
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            }
        };
    });

    // --- BÖLGELER VE MASALAR EKRANI SEKMELERİ (TABS) ---
    const regionTabs = document.querySelectorAll('.region-tab-item');
    const tableGrids = document.querySelectorAll('.tables-grid-premium');

    regionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Önce tüm sekmelerden ve tablolardan 'active' class'ını kaldır
            regionTabs.forEach(t => t.classList.remove('active'));
            tableGrids.forEach(g => g.classList.remove('active'));

            // Sadece tıklanan sekmeyi ve ilgili tabloyu aktif et
            tab.classList.add('active');
            const region = tab.getAttribute('data-region');
            const targetGrid = document.querySelector(`.tables-grid-premium[data-region="${region}"]`);
            if(targetGrid) {
                targetGrid.classList.add('active');
            }
            
            // Kroki görünümünü de güncelle
            const allLayouts = document.querySelectorAll('.cafe-layout');
            allLayouts.forEach(layout => layout.classList.remove('active'));
            
            // Seçilen bölgenin krokisini göster
            const targetLayout = document.querySelector(`#layout-${region}`);
            if(targetLayout) {
                targetLayout.classList.add('active');
                
                // Kroki başlığını güncelle
                const layoutTitle = document.getElementById('layout-title');
                if (layoutTitle) {
                    // Bölge adını al (sekmedeki metinden)
                    const regionFullText = tab.textContent;
                    // Sayı içeren kısmı (örn. 5/10) kaldır
                    const regionName = regionFullText.replace(/\d+\/\d+/, '').trim();
                    layoutTitle.textContent = `${regionName} Krokisi`;
                }
            }
        });
    });
    
    // --- MENÜ DÜZENLEYİCİ KATEGORİ SEÇİMİ ---
    const categoryItems = document.querySelectorAll('.category-item');

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Önce tüm kategorilerden 'active' class'ını kaldır
            categoryItems.forEach(i => i.classList.remove('active'));
            // Sadece tıklanan kategoriyi aktif et
            item.classList.add('active');
            // Burada, seçilen kategoriye göre ürünleri filtreleme mantığı eklenecek
            console.log(item.querySelector('.category-name').textContent + " kategorisi seçildi.");
        });
    });

    // --- MENÜ DÜZENLEYİCİ MODAL YÖNETİMİ ---
    const addCategoryBtn = document.querySelector('.categories-panel .btn-panel-add');
    const addProductBtn = document.querySelector('.products-panel .btn-panel-add');
    const addCategoryModal = document.querySelector('#add-category-modal');
    const addProductModal = document.querySelector('#add-product-modal');
    const modalOverlay = document.querySelector('#modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const allCloseBtns = document.querySelectorAll('.modal-close-btn');

    const openModal = (modal) => {
        if (!modal) return;
        modalOverlay.classList.add('active');
        modal.classList.add('active');
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        allModals.forEach(modal => modal.classList.remove('active'));
    };

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(addCategoryModal);
        });
    }

    if (addProductBtn) {
        addProductBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(addProductModal);
        });
    }

    allCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // --- BÖLGE DÜZENLEME MODAL ETKİLEŞİMLERİ ---
    const modalRegionTabs = document.querySelectorAll('.region-tabs-modal .region-tab-item');
    const regionEditForms = document.querySelectorAll('.region-edit-form');
    
    // Bölge sekmelerine tıklama olaylarını ekle
    modalRegionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Yeni bölge ekleme sekmesi ise
            if (tab.classList.contains('add-region')) {
                modalRegionTabs.forEach(t => t.classList.remove('active'));
                regionEditForms.forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                document.querySelector('[data-modal-region-form="new"]').classList.add('active');
                return;
            }
            
            // Diğer bölge sekmeleri için
            const region = tab.getAttribute('data-modal-region');
            modalRegionTabs.forEach(t => t.classList.remove('active'));
            regionEditForms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`[data-modal-region-form="${region}"]`).classList.add('active');
        });
    });
    
    // --- YENİ MASA EKLE MODAL ETKİLEŞİMLERİ ---
    const positionX = document.querySelector('#position-x');
    const positionY = document.querySelector('#position-y');
    const positionXValue = document.querySelector('#position-x + .range-value');
    const positionYValue = document.querySelector('#position-y + .range-value');
    const newTableMarker = document.querySelector('#new-table-marker');
    const previewClickArea = document.querySelector('#preview-click-area');
    const positionPreview = document.querySelector('#position-preview');
    const tableRegionSelect = document.querySelector('#table-region');
    const tableShapeSelect = document.querySelector('#table-shape');
    
    // Masa şeklini değiştir
    if (tableShapeSelect && newTableMarker) {
        tableShapeSelect.addEventListener('change', () => {
            newTableMarker.className = 'new-table-preview';
            
            switch (tableShapeSelect.value) {
                case 'round':
                    newTableMarker.style.borderRadius = '50%';
                    break;
                case 'rectangle':
                    newTableMarker.style.borderRadius = '3px';
                    newTableMarker.style.width = '32px';
                    newTableMarker.style.height = '24px';
                    break;
                default: // square
                    newTableMarker.style.borderRadius = '3px';
                    newTableMarker.style.width = '28px';
                    newTableMarker.style.height = '28px';
            }
        });
    }
    
    // Bölge görünümleri arasında geçiş için
    const regionToggleBtns = document.querySelectorAll('.region-toggle-btn');
    const regionPreviews = document.querySelectorAll('.region-preview');
    const regionAllPreview = document.querySelector('#region-all');
    
    // Bölge geçiş butonları
    regionToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewType = btn.getAttribute('data-region-view');
            
            // Buton stillerini güncelle
            regionToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (viewType === 'all') {
                // Tüm mekan görünümü
                regionPreviews.forEach(preview => preview.classList.remove('active'));
                regionAllPreview.classList.add('active');
            } else {
                // Seçili bölge görünümü
                regionAllPreview.classList.remove('active');
                
                // Seçili bölgenin ID'sini al ve o görünümü aktifleştir
                if (tableRegionSelect) {
                    const selectedRegion = tableRegionSelect.value;
                    regionPreviews.forEach(preview => preview.classList.remove('active'));
                    document.querySelector(`#region-${selectedRegion}`).classList.add('active');
                }
            }
        });
    });
    
    // Bölgeyi değiştirdiğinde ön izleme alanında göster
    if (tableRegionSelect) {
        tableRegionSelect.addEventListener('change', () => {
            const region = tableRegionSelect.value;
            let leftPos = 25;
            
            if (region === 'ornek') { // İç mekan seçildiğinde
                leftPos = 75; // Sağ tarafa yerleştir
            }
            
            // Eğer X konumu zaten güncellendiyse, manuel ayarlanan değeri koruyalım
            if (newTableMarker && !newTableMarker.dataset.manuallyPlaced) {
                newTableMarker.style.left = leftPos + '%';
                positionX.value = leftPos;
                positionXValue.textContent = leftPos + '%';
            }
            
            // Bölge görünümünü güncelle (eğer "Seçili Bölge" modu aktifse)
            const activeViewBtn = document.querySelector('.region-toggle-btn.active');
            if (activeViewBtn && activeViewBtn.getAttribute('data-region-view') === 'active') {
                regionPreviews.forEach(preview => preview.classList.remove('active'));
                document.querySelector(`#region-${region}`).classList.add('active');
            }
        });
    }
    
    // Masa konumunu güncelleme fonksiyonu
    const updateTablePosition = (x, y) => {
        if (newTableMarker) {
            newTableMarker.style.left = x + '%';
            newTableMarker.style.top = y + '%';
            
            // Kaydırıcıların değerlerini güncelle
            if (positionX && positionXValue) {
                positionX.value = x;
                positionXValue.textContent = x + '%';
            }
            
            if (positionY && positionYValue) {
                positionY.value = y;
                positionYValue.textContent = y + '%';
            }
            
            // Manuel yerleştirme işareti
            newTableMarker.dataset.manuallyPlaced = 'true';
            
            // Eğer sol bölgede ise Bahçe, sağ bölgede ise İç Mekan olarak ayarla
            if (tableRegionSelect) {
                const regionValue = (x < 55) ? 'deneme' : 'ornek';
                tableRegionSelect.value = regionValue;
            }
        }
    };
    
    // X ve Y pozisyon kaydırıcılarının değer gösterimlerini güncelle
    if (positionX && positionXValue) {
        positionX.addEventListener('input', () => {
            const x = positionX.value;
            positionXValue.textContent = x + '%';
            
            if (newTableMarker) {
                newTableMarker.style.left = x + '%';
                newTableMarker.dataset.manuallyPlaced = 'true';
                
                // Bölge seçimini güncelle
                if (tableRegionSelect) {
                    const regionValue = (parseInt(x) < 55) ? 'deneme' : 'ornek';
                    tableRegionSelect.value = regionValue;
                }
            }
        });
    }
    
    if (positionY && positionYValue) {
        positionY.addEventListener('input', () => {
            const y = positionY.value;
            positionYValue.textContent = y + '%';
            
            if (newTableMarker) {
                newTableMarker.style.top = y + '%';
                newTableMarker.dataset.manuallyPlaced = 'true';
            }
        });
    }
    
    // Önizleme alanına tıklama ile konum belirleme
    if (previewClickArea) {
        previewClickArea.addEventListener('click', (e) => {
            // Tıklama pozisyonunu hesapla
            const rect = positionPreview.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) / rect.width * 100);
            const y = Math.round((e.clientY - rect.top) / rect.height * 100);
            
            // Masa pozisyonunu güncelle
            updateTablePosition(x, y);
            
            // Aktif görünüm "Tüm Mekan" ise ve sol/sağ kontrolüne göre bölge seçildiyse
            // görünümü otomatik olarak seçilen bölgeye çevir
            const activeViewBtn = document.querySelector('.region-toggle-btn.active');
            if (activeViewBtn && activeViewBtn.getAttribute('data-region-view') === 'active') {
                const selectedRegion = (x < 55) ? 'deneme' : 'ornek';
                regionPreviews.forEach(preview => preview.classList.remove('active'));
                document.querySelector(`#region-${selectedRegion}`).classList.add('active');
            }
        });
    }
    
    // Sürükle-bırak fonksiyonu için
    if (newTableMarker && positionPreview) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        newTableMarker.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            
            // Başlangıç pozisyonları
            startX = e.clientX;
            startY = e.clientY;
            
            // Mevcut pozisyonu al (% değil px olarak)
            const rect = newTableMarker.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            // Mouse takip fonksiyonunu ekle
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            // Fare hareketi farkını hesapla
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // Preview container'ın sınırlarını al
            const previewRect = positionPreview.getBoundingClientRect();
            
            // Yeni pozisyonu hesapla (% olarak)
            let newX = ((startLeft + dx) - previewRect.left) / previewRect.width * 100;
            let newY = ((startTop + dy) - previewRect.top) / previewRect.height * 100;
            
            // Sınırları kontrol et (5% ile 95% arasında)
            newX = Math.min(Math.max(newX, 5), 95);
            newY = Math.min(Math.max(newY, 5), 95);
            
            // Pozisyonu güncelle
            updateTablePosition(Math.round(newX), Math.round(newY));
        };
        
        const handleMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }

    // --- KAFE KROKİSİ ANİMASYON VE ETKİLEŞİMİ ---
    const cafeTables = document.querySelectorAll('.cafe-table');
    const tableCards = document.querySelectorAll('.table-card-premium');

    const clearHighlights = () => {
        cafeTables.forEach(t => t.classList.remove('highlight'));
        tableCards.forEach(c => c.classList.remove('highlight'));
    };

    const highlightElements = (tableId) => {
        if (!tableId) return;
        clearHighlights();
        
        const cafeTable = document.querySelector(`.cafe-table[data-table-id="${tableId}"]`);
        const tableCard = document.querySelector(`.table-card-premium[data-table-id="${tableId}"]`);

        if (cafeTable && tableCard) {
            cafeTable.classList.add('highlight');
            tableCard.classList.add('highlight');
            
            // Kartı görünür alana kaydır
            tableCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    cafeTables.forEach(table => {
        table.addEventListener('click', () => {
            const tableId = table.dataset.tableId;
            highlightElements(tableId);
        });
    });

    tableCards.forEach(card => {
        card.addEventListener('click', () => {
            const tableId = card.dataset.tableId;
            highlightElements(tableId);
        });
    });


    // --- ORİJİNAL KAHVE PROJESİNDEN GELEN FONKSİYONLAR ---

    // Ana sayfadaki küçük resimlere tıklayınca büyük resmi değiştirme
    document.querySelectorAll('.image-slider img').forEach(images => {
        images.onclick = () => {
            const src = images.getAttribute('src');
            const mainImage = document.querySelector('.main-home-image');
            if (mainImage) {
                mainImage.src = src;
            }
        };
    });

    // Swiper kütüphanesini kullanarak "reviews" bölümündeki slider'ı oluşturma
    new Swiper(".review-slider", {
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
        },
    });
});
  // --- SİPARİŞ AKIŞI (KANBAN) MODAL YÖNETİMİ ---
    const orderDetailsModal = document.querySelector('#order-details-modal');

    // Kanban panosundaki tüm "göz" butonlarını seç
    const openModalButtons = document.querySelectorAll('.open-modal-btn');

    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Kartın kendisine tıklama olayını tetiklemesini engelle

            // En yakın kartı bul
            const card = button.closest('.kanban-card-premium');
            if (card && orderDetailsModal) {
                // Karttan verileri çek
                const orderType = card.querySelector('.order-type').textContent.trim();
                const orderId = card.querySelector('.order-id').textContent.trim();
                const products = card.querySelector('.products-list').textContent.trim();
                const price = card.querySelector('.card-price').textContent.trim();
                // Not alanı olmayabilir, bu yüzden varlığını kontrol et
                const noteElement = card.querySelector('.card-note');
                const note = noteElement && noteElement.textContent.trim() !== '' ? noteElement.textContent.trim() : 'Not bulunmuyor.';

                // Modal içindeki ilgili alanları doldur
                orderDetailsModal.querySelector('#modal-order-id').textContent = orderId;
                orderDetailsModal.querySelector('#modal-order-type').textContent = orderType.replace(orderId, '').trim();
                orderDetailsModal.querySelector('#modal-order-products').textContent = products;
                orderDetailsModal.querySelector('#modal-order-price').textContent = price;
                orderDetailsModal.querySelector('#modal-order-note').textContent = note;

                // openModal fonksiyonunu çağırarak modalı göster
                openModal(orderDetailsModal);
            }
        });
    });
