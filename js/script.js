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
        } else if (targetId === '#sales-report-view') {
            // "Satış Raporları" ekranı için özel buton
            const btn1 = document.createElement('a');
            btn1.href = '#';
            btn1.className = 'btn premium-btn';
            btn1.innerHTML = '<i class="fas fa-file-export"></i> Raporu İndir';
            headerActions.appendChild(btn1);
            
            const btn2 = document.createElement('a');
            btn2.href = '#';
            btn2.className = 'btn premium-btn alt';
            btn2.innerHTML = '<i class="fas fa-calendar-alt"></i> Tarih Seç';
            headerActions.appendChild(btn2);
        } else if (targetId === '#income-expense-view') {
            // "Gelir & Gider" ekranı için özel buton
            const btn1 = document.createElement('a');
            btn1.href = '#';
            btn1.className = 'btn premium-btn';
            btn1.innerHTML = '<i class="fas fa-plus"></i> Yeni İşlem Ekle';
            headerActions.appendChild(btn1);
            
            const btn2 = document.createElement('a');
            btn2.href = '#';
            btn2.className = 'btn premium-btn alt';
            btn2.innerHTML = '<i class="fas fa-file-export"></i> Finansal Rapor';
            headerActions.appendChild(btn2);
        } else if (targetId === '#cost-analysis-view') {
            // "Maliyet Analizi" ekranı için özel buton
            const btn1 = document.createElement('a');
            btn1.href = '#';
            btn1.className = 'btn premium-btn';
            btn1.innerHTML = '<i class="fas fa-plus"></i> Yeni Ürün Ekle';
            headerActions.appendChild(btn1);
            
            const btn2 = document.createElement('a');
            btn2.href = '#';
            btn2.className = 'btn premium-btn alt';
            btn2.innerHTML = '<i class="fas fa-file-export"></i> Maliyet Raporu';
            headerActions.appendChild(btn2);
        }
        else if (targetId === '#user-management-view') {
            const btn1 = document.createElement('a');
            btn1.href = '#';
            btn1.className = 'btn premium-btn';
            btn1.innerHTML = '<i class="fas fa-user-plus"></i> Yeni Kullanıcı';
            btn1.id = 'header-add-user-btn';
            headerActions.appendChild(btn1);

            btn1.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(document.querySelector('#add-user-modal'));
            });
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
            console.log('sidebar link clicked:', link.getAttribute('href'));
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
               
                // Sayfa geçişinde her zaman sidebar'ı kapat
                closeSidebar();
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
    
    // --- SİPARİŞ AKIŞI (KANBAN) MODAL YÖNETİMİ (DOMContentLoaded içinde) ---
    const orderDetailsModal = document.querySelector('#order-details-modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = button.closest('.kanban-card-premium');
            if (card && orderDetailsModal) {
                const orderType = card.querySelector('.order-type')?.textContent.trim() || '';
                const orderId = card.querySelector('.order-id')?.textContent.trim() || '';
                const products = card.querySelector('.products-list')?.textContent.trim() || '';
                const price = card.querySelector('.card-price')?.textContent.trim() || '';
                const noteElement = card.querySelector('.card-note');
                const note = noteElement && noteElement.textContent.trim() !== '' ? noteElement.textContent.trim() : 'Not bulunmuyor.';

                orderDetailsModal.querySelector('#modal-order-id').textContent = orderId;
                orderDetailsModal.querySelector('#modal-order-type').textContent = orderType.replace(orderId, '').trim();
                orderDetailsModal.querySelector('#modal-order-products').textContent = products;
                orderDetailsModal.querySelector('#modal-order-price').textContent = price;
                orderDetailsModal.querySelector('#modal-order-note').textContent = note;

                openModal(orderDetailsModal);
            }
        });
    });

    // --- KULLANICI YÖNETİMİ (Modal ve Liste Yönetimi) ---
    const addUserBtn = document.getElementById('add-user-btn');
    const addUserModal = document.getElementById('add-user-modal');
    const addUserForm = document.getElementById('add-user-form');
    const userListEl = document.getElementById('user-list');
    const userSearch = document.getElementById('user-search');
    const userRoleFilter = document.getElementById('user-role-filter');

    // Açma butonu varsa modalı aç
    if (addUserBtn) {
        addUserBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(addUserModal);
        });
    }

    // Form gönderildiğinde basit kullanıcı ekleme (DOM tarafında)
    if (addUserForm && userListEl) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('new-user-name').value.trim();
            const email = document.getElementById('new-user-email').value.trim();
            const role = document.getElementById('new-user-role').value;

            if (!name || !email) return;

            // Basit ID üretimi
            const id = Date.now();

            const tr = document.createElement('tr');
            tr.className = 'user-row';
            tr.dataset.userId = id;
            tr.innerHTML = `
                <td class="user-col"><div class="avatar">${name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div><div class="user-meta"><div class="name">${name}</div><div class="sub">${email}</div></div></td>
                <td>${name.replace(/\s+/g, '').toLowerCase()}</td>
                <td><span class="role-badge">${role}</span></td>
                <td><div class="email">${email}</div></td>
                <td>--:--</td>
                <td><span class="status">Pasif</span></td>
                <td class="actions"><button class="btn" data-action="edit-user" data-user-id="${id}"><i class="fas fa-user-cog"></i></button><button class="btn" data-action="delete-user" data-user-id="${id}"><i class="fas fa-trash-alt"></i></button></td>
            `;
            // Prepend to the tbody
            userListEl.prepend(tr);

            // Formu sıfırla ve modalı kapat
            addUserForm.reset();
            closeModal();

            // İstatistikleri güncelle (basit sayma)
            updateUserStats();
        });
    }

    // Silme ve düzenleme butonları için event delegation
    if (userListEl) {
        userListEl.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.dataset.action;
            const uid = btn.dataset.userId;
            if (action === 'delete-user') {
                // open confirm delete modal
                const confirmModal = document.getElementById('confirm-delete-modal');
                confirmModal.dataset.deleteId = uid;
                openModal(confirmModal);
            }
            if (action === 'edit-user') {
                // open edit modal and prefill values
                const row = document.querySelector(`.user-row[data-user-id="${uid}"]`);
                if (!row) return;
                const name = row.querySelector('.user-meta .name')?.textContent || '';
                const email = row.querySelector('.user-meta .sub')?.textContent || '';
                const role = row.querySelector('.role-badge')?.textContent || 'staff';
                document.getElementById('edit-user-name').value = name;
                document.getElementById('edit-user-email').value = email;
                document.getElementById('edit-user-role').value = role.toLowerCase();
                const editModal = document.getElementById('edit-user-modal');
                editModal.dataset.editId = uid;
                openModal(editModal);
            }
        });
    }

    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', (e) => {
            const confirmModal = document.getElementById('confirm-delete-modal');
            const idToDelete = confirmModal.dataset.deleteId;
            if (idToDelete) {
                const row = document.querySelector(`.user-row[data-user-id="${idToDelete}"]`);
                row?.remove();
                updateUserStats();
            }
            closeModal();
        });
    }

    // Edit user submit
    const editUserForm = document.getElementById('edit-user-form');
    if (editUserForm) {
        editUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editModal = document.getElementById('edit-user-modal');
            const uid = editModal.dataset.editId;
            const row = document.querySelector(`.user-row[data-user-id="${uid}"]`);
            if (!row) return;
            const newName = document.getElementById('edit-user-name').value.trim();
            const newEmail = document.getElementById('edit-user-email').value.trim();
            const newRole = document.getElementById('edit-user-role').value;
            // update DOM
            row.querySelector('.user-meta .name').textContent = newName;
            row.querySelector('.user-meta .sub').textContent = newEmail;
            const roleBadge = row.querySelector('.role-badge');
            if (roleBadge) roleBadge.textContent = newRole.charAt(0).toUpperCase() + newRole.slice(1);
            closeModal();
        });
    }

    // Basit arama/filtreleme
    const filterUserRows = () => {
        const q = userSearch?.value.trim().toLowerCase() || '';
        const role = userRoleFilter?.value || 'all';
        document.querySelectorAll('#user-list .user-row').forEach(row => {
            const text = row.textContent.toLowerCase();
            const matchesQuery = q === '' || text.includes(q);
            const matchesRole = role === 'all' || text.includes(role);
            row.style.display = (matchesQuery && matchesRole) ? 'flex' : 'none';
        });
    };

    if (userSearch) userSearch.addEventListener('input', filterUserRows);
    if (userRoleFilter) userRoleFilter.addEventListener('change', filterUserRows);

    const updateUserStats = () => {
        const rows = document.querySelectorAll('#user-list .user-row');
        document.getElementById('stat-total').textContent = rows.length;
        // Basit rollere göre sayma
        document.getElementById('stat-admin').textContent = document.querySelectorAll('#user-list .user-row').length; // placeholder
        // Daha gelişmiş rol takibi için veri modeli eklenmeli
    };
    
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

    // --- KDS (Mutfak Ekranı) MOCK & LOGİK ---
    const kdsState = {
        tickets: [],
        filter: {
            q: '',
            type: 'all',
            station: 'all',
            onlyUrgent: false,
            sort: 'time-desc'
        }
    };

    // Mock siparişler
    const seedKdsTickets = () => ([
        { id: 'T-1024', type: 'dine-in', table: 'Masa 12', status: 'new', createdAt: Date.now() - 1000*60*7, station: 'drink', items: ['2x Latte', '1x Su'], note: 'Bardaklar büyük', urgent: true, slaMin: 10 },
        { id: 'T-1025', type: 'take-away', table: 'Gel-Al', status: 'new', createdAt: Date.now() - 1000*60*2, station: 'hot', items: ['1x Tavuk Sote', '1x Pilav'], note: '', urgent: false, slaMin: 15 },
        { id: 'T-1026', type: 'delivery', table: 'Paket', status: 'preparing', createdAt: Date.now() - 1000*60*18, station: 'cold', items: ['2x Salata'], note: 'Soğan çıkart', urgent: true, slaMin: 12 },
        { id: 'T-1027', type: 'dine-in', table: 'Masa 5', status: 'preparing', createdAt: Date.now() - 1000*60*5, station: 'dessert', items: ['1x Cheesecake'], note: '', urgent: false, slaMin: 8 },
        { id: 'T-1028', type: 'dine-in', table: 'Masa 4', status: 'ready', createdAt: Date.now() - 1000*60*20, station: 'drink', items: ['1x Espresso'], note: 'Şekerli', urgent: false, slaMin: 5 }
    ]);

    const kdsEls = {
        search: document.getElementById('kds-search-input'),
        type: document.getElementById('kds-filter-type'),
        station: document.getElementById('kds-filter-station'),
        onlyUrgent: document.getElementById('kds-only-urgent'),
        sort: document.getElementById('kds-sort'),
        lists: {
            new: document.getElementById('kds-list-new'),
            preparing: document.getElementById('kds-list-preparing'),
            ready: document.getElementById('kds-list-ready'),
        },
        counts: {
            new: document.getElementById('kds-count-new'),
            preparing: document.getElementById('kds-count-preparing'),
            ready: document.getElementById('kds-count-ready'),
        },
        clock: document.getElementById('kds-clock')
    };

    const kdsFormatMins = (ms) => Math.floor(ms/60000);
    const kdsElapsed = (createdAt) => kdsFormatMins(Date.now() - createdAt);
    const kdsSlaClass = (ticket) => kdsElapsed(ticket.createdAt) >= ticket.slaMin ? 'sla-warn' : 'sla-okay';

    const renderTicket = (t) => {
        const elapsedMin = kdsElapsed(t.createdAt);
        const wrapper = document.createElement('div');
        wrapper.className = `kds-ticket ${kdsSlaClass(t)}`;
        wrapper.dataset.id = t.id;
        wrapper.innerHTML = `
            <div class="kds-ticket-header">
                <strong>${t.table}</strong>
                <span class="kds-time">${elapsedMin} dk</span>
            </div>
            <div class="kds-badges">
                <span class="kds-badge">#${t.id}</span>
                ${t.urgent ? '<span class="kds-badge urgent"><i class="fas fa-flag"></i> Acil</span>' : ''}
                <span class="kds-badge station">${t.station}</span>
                <span class="kds-badge type ${t.type}">${t.type === 'dine-in' ? 'Masa' : t.type === 'take-away' ? 'Gel-Al' : 'Paket'}</span>
            </div>
            <div class="kds-items">${t.items.join(', ')}</div>
            ${t.note ? `<div class="kds-note"><i class="fas fa-sticky-note"></i> ${t.note}</div>` : ''}
            <div class="kds-actions">
                ${t.status !== 'preparing' ? '<button class="kds-btn" data-action="to-preparing"><i class="fas fa-play"></i> Başlat</button>' : ''}
                ${t.status !== 'ready' ? '<button class="kds-btn" data-action="to-ready"><i class="fas fa-check"></i> Hazır</button>' : ''}
                ${t.status !== 'new' ? '<button class="kds-btn" data-action="to-new"><i class="fas fa-undo"></i> Geri Al</button>' : ''}
                <button class="kds-btn" data-action="print"><i class="fas fa-print"></i> Yazdır</button>
            </div>
        `;

        // Action handlers
        wrapper.querySelectorAll('.kds-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                if (action === 'to-preparing') t.status = 'preparing';
                if (action === 'to-ready') t.status = 'ready';
                if (action === 'to-new') t.status = 'new';
                if (action === 'print') {
                    // Basit yazdırma: yeni bir pencere açıp yazdırılabilir fiş şablonu basıyoruz
                    const w = window.open('', '_blank');
                    const created = new Date(t.createdAt);
                    w.document.write(`
                        <html><head><title>${t.id} Fiş</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 10px; }
                            h2 { margin: 0 0 8px; font-size: 18px; }
                            .meta { font-size: 12px; margin-bottom: 8px; }
                            ul { padding-left: 18px; margin: 6px 0; }
                            li { font-size: 14px; margin: 2px 0; }
                            .note { margin-top: 8px; font-size: 12px; }
                        </style>
                        </head><body>
                            <h2>Mutfağa Fiş</h2>
                            <div class="meta">
                                <div><strong>Sipariş:</strong> ${t.id}</div>
                                <div><strong>Tür:</strong> ${t.type === 'dine-in' ? 'Masa' : t.type === 'take-away' ? 'Gel-Al' : 'Paket'} - ${t.table}</div>
                                <div><strong>İstasyon:</strong> ${t.station}</div>
                                <div><strong>Oluşturma:</strong> ${created.toLocaleString()}</div>
                                <div><strong>Durum:</strong> ${t.status}</div>
                            </div>
                            <div><strong>Ürünler</strong></div>
                            <ul>${t.items.map(i => `<li>${i}</li>`).join('')}</ul>
                            ${t.note ? `<div class="note"><strong>Not:</strong> ${t.note}</div>` : ''}
                            <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 300); }<\/script>
                        </body></html>
                    `);
                    return; // yeniden render etmeden çık
                }
                saveAndRender();
            });
        });

        return wrapper;
    };

    const applyFilters = (list) => {
        const { q, type, station, onlyUrgent, sort } = kdsState.filter;
        let arr = list.filter(t => {
            const text = `${t.id} ${t.table} ${t.items.join(' ')}`.toLowerCase();
            const matchQ = !q || text.includes(q.toLowerCase());
            const matchType = type === 'all' || t.type === type;
            const matchStation = station === 'all' || t.station === station;
            const matchUrgent = !onlyUrgent || t.urgent;
            return matchQ && matchType && matchStation && matchUrgent;
        });

        if (sort === 'time-desc') arr.sort((a,b) => a.createdAt - b.createdAt); // eski önce
        if (sort === 'time-asc') arr.sort((a,b) => b.createdAt - a.createdAt);   // yeni önce
        if (sort === 'sla') arr.sort((a,b) => (kdsElapsed(b.createdAt)/b.slaMin) - (kdsElapsed(a.createdAt)/a.slaMin));
        return arr;
    };

    const renderAll = () => {
        if (!kdsEls.lists.new) return; // KDS görünümü henüz yüklenmediyse çık
        const grouped = {
            new: [], preparing: [], ready: []
        };
        kdsState.tickets.forEach(t => grouped[t.status]?.push(t));

        // Clear lists
        Object.values(kdsEls.lists).forEach(el => el.innerHTML = '');

        // Render with filters
        Object.keys(grouped).forEach(k => {
            const filtered = applyFilters(grouped[k]);
            kdsEls.counts[k].textContent = String(filtered.length);
            filtered.forEach(t => kdsEls.lists[k].appendChild(renderTicket(t)));
        });
    };

    const saveAndRender = () => {
        localStorage.setItem('kdsTickets', JSON.stringify(kdsState.tickets));
        renderAll();
    };

    const loadKds = () => {
        const saved = localStorage.getItem('kdsTickets');
        if (saved) {
            try { kdsState.tickets = JSON.parse(saved); }
            catch { kdsState.tickets = seedKdsTickets(); }
        } else {
            kdsState.tickets = seedKdsTickets();
        }
        renderAll();
    };

    // Event bindings
    if (kdsEls.search) kdsEls.search.addEventListener('input', (e) => { kdsState.filter.q = e.target.value; renderAll(); });
    if (kdsEls.type) kdsEls.type.addEventListener('change', (e) => { kdsState.filter.type = e.target.value; renderAll(); });
    if (kdsEls.station) kdsEls.station.addEventListener('change', (e) => { kdsState.filter.station = e.target.value; renderAll(); });
    if (kdsEls.onlyUrgent) kdsEls.onlyUrgent.addEventListener('change', (e) => { kdsState.filter.onlyUrgent = e.target.checked; renderAll(); });
    if (kdsEls.sort) kdsEls.sort.addEventListener('change', (e) => { kdsState.filter.sort = e.target.value; renderAll(); });

    // Saat
    if (kdsEls.clock) {
        const updClock = () => {
            const d = new Date();
            const pad = (n) => n.toString().padStart(2, '0');
            kdsEls.clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
        updClock();
        setInterval(updClock, 1000*15);
    }

    // Her dakika kartların sürelerini ve SLA sınıflarını tazele
    setInterval(() => {
        if (!document.querySelector('#kds-view') || document.querySelector('#kds-view').classList.contains('view-hidden')) return;
        renderAll();
    }, 1000*60);

    // KDS görünümü ilk kez açıldığında yükle
    const kdsMenuLink = document.querySelector('a[href="#kds-view"]');
    if (kdsMenuLink) {
        kdsMenuLink.addEventListener('click', () => {
            // küçük bir gecikmeyle render (DOM göründüğünde)
            setTimeout(() => {
                if (!kdsState.tickets.length) loadKds(); else renderAll();
            }, 50);
        });
    }

    // --- SİPARİŞ EKLE (ORDER CREATE) ---
    const oc = {
        type: document.getElementById('oc-order-type'),
        tableGroup: document.getElementById('oc-table-group'),
        custGroup: document.getElementById('oc-customer-group'),
        addressGroup: document.getElementById('oc-address-group'),
        productGrid: document.getElementById('oc-product-grid'),
        selectedList: document.getElementById('oc-selected-list'),
        total: document.getElementById('oc-total'),
        saveBtn: document.getElementById('oc-save-btn'),
        printBtn: document.getElementById('oc-print-btn')
    };

    const ocProducts = [
        { id: 'P1', name: 'Espresso', price: 25.00 },
        { id: 'P2', name: 'Latte', price: 35.00 },
        { id: 'P3', name: 'Filtre Kahve', price: 32.00 },
        { id: 'P4', name: 'Cheesecake', price: 45.00 },
        { id: 'P5', name: 'Brownie', price: 40.00 },
        { id: 'P6', name: 'Soğuk Kahve', price: 38.00 },
    ];
    let ocCart = [];

    const fmt = (n)=> `₺${n.toFixed(2).replace('.', ',')}`;

    const renderOcProducts = () => {
        if (!oc.productGrid) return;
        oc.productGrid.innerHTML = '';
        ocProducts.forEach(p => {
            const el = document.createElement('div');
            el.className = 'product-card';
            el.innerHTML = `
                <h4>${p.name}</h4>
                <div class="price">${fmt(p.price)}</div>
                <div class="actions">
                  <button data-id="${p.id}">Ekle</button>
                </div>
            `;
            el.querySelector('button')?.addEventListener('click', ()=>{
                const found = ocCart.find(i=>i.id===p.id);
                if (found) found.qty++; else ocCart.push({ ...p, qty: 1 });
                renderOcSelected();
            });
            oc.productGrid.appendChild(el);
        });
    };

    const renderOcSelected = () => {
        if (!oc.selectedList) return;
        oc.selectedList.innerHTML = '';
        let total = 0;
        ocCart.forEach(item => {
            const lineTotal = item.qty * item.price; total += lineTotal;
            const row = document.createElement('div');
            row.className = 'selected-item';
            row.innerHTML = `
                <div class="name">${item.name}</div>
                <div class="qty">
                    <button data-act="dec">-</button>
                    <span>${item.qty}</span>
                    <button data-act="inc">+</button>
                </div>
                <div class="line-total">${fmt(lineTotal)}</div>
            `;
            row.querySelector('[data-act="dec"]').addEventListener('click', ()=>{ item.qty = Math.max(0, item.qty-1); if(item.qty===0){ ocCart = ocCart.filter(i=>i.id!==item.id);} renderOcSelected(); });
            row.querySelector('[data-act="inc"]').addEventListener('click', ()=>{ item.qty++; renderOcSelected(); });
            oc.selectedList.appendChild(row);
        });
        if (oc.total) oc.total.textContent = fmt(total);
    };

    const updateOcVisibility = () => {
        if (!oc.type) return;
        const v = oc.type.value;
        // Masa: masa alanı açık, müşteri/adres kapalı
        // Gel-Al: masa kapalı, müşteri açık, adres kapalı
        // Paket: masa kapalı, müşteri ve adres açık
        if (oc.tableGroup) oc.tableGroup.style.display = (v === 'dine-in') ? '' : 'none';
        if (oc.custGroup) oc.custGroup.style.display = (v !== 'dine-in') ? '' : 'none';
        if (oc.addressGroup) oc.addressGroup.style.display = (v === 'delivery') ? '' : 'none';
    };

    if (oc.type) {
        oc.type.addEventListener('change', updateOcVisibility);
        updateOcVisibility();
    }

    // Sayfa açıldığında ürün gridini hazırla
    const ocMenuLink = document.querySelector('a[href="#siparis-ekle-view"]');
    if (ocMenuLink) {
        ocMenuLink.addEventListener('click', () => {
            setTimeout(() => { renderOcProducts(); renderOcSelected(); }, 50);
        });
    }

    // Basit kaydet/yazdır handler’ları (mock)
    oc.saveBtn?.addEventListener('click', (e)=>{ e.preventDefault(); alert('Sipariş kaydedildi (mock)'); });
    oc.printBtn?.addEventListener('click', (e)=>{ e.preventDefault(); alert('Yazdırma (mock)'); });
});
    
    // --- MALİYET ANALİZİ FONKSİYONLARI ---
    if (document.getElementById('cost-analysis-view')) {
        // Maliyet tablosu sıralama ve filtreleme
        const costSearchInput = document.querySelector('.cost-search input');
        const costFilter = document.querySelector('.cost-filter');
        const costTable = document.querySelector('.cost-table');
        
        if (costSearchInput) {
            costSearchInput.addEventListener('input', () => {
                const searchValue = costSearchInput.value.toLowerCase();
                const rows = costTable.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const productName = row.querySelector('td:first-child').textContent.toLowerCase();
                    const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    
                    if (productName.includes(searchValue) || category.includes(searchValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
        
        if (costFilter) {
            costFilter.addEventListener('change', () => {
                const filterValue = costFilter.value;
                const rows = costTable.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    
                    if (filterValue === 'all' || category.toLowerCase() === filterValue.toLowerCase()) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }

        // "Yeni Ürün" butonu
        const btnCostAdd = document.querySelector('.btn-cost-add');
        if (btnCostAdd) {
            btnCostAdd.addEventListener('click', () => {
                alert('Yeni ürün ekleme modalı burada açılacak');
                // Burada modal açma kodu yer alabilir
            });
        }

        // Tablo aksiyon butonları
        const tableActionButtons = document.querySelectorAll('.table-action-btn');
        tableActionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.closest('button').querySelector('i').classList.contains('fa-pencil-alt') ? 'edit' : 'delete';
                const row = e.target.closest('tr');
                const productName = row.querySelector('td:first-child').textContent;
                
                if (action === 'edit') {
                    alert(`${productName} ürününü düzenleme modalı burada açılacak`);
                } else {
                    if (confirm(`${productName} ürününü silmek istediğinizden emin misiniz?`)) {
                        // Silme işlemi burada gerçekleşecek
                        row.style.opacity = '0.5';
                        setTimeout(() => {
                            row.remove();
                        }, 500);
                    }
                }
            });
        });

        // Grafikler için animasyon
        const animateChartBars = () => {
            const chartBars = document.querySelectorAll('.chart-bar');
            chartBars.forEach(bar => {
                const targetWidth = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            });
        };

        // Sayfa yüklendiğinde grafikleri animasyonlu şekilde göster
        animateChartBars();
        
        // Sayfalama butonları
        const paginationButtons = document.querySelectorAll('.pagination-btn');
        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Burada gerçek sayfalama kodu yer alabilir
                // Şimdilik sadece bildirim verelim
                alert('Sayfalama özelliği aktif edilecek');
            });
        });
    }
