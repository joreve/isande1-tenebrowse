/**
 * Tenebrowse - General Manager Requests
 * Handles Material Requests and Substitution Requests in one tabbed page.
 */

document.addEventListener('DOMContentLoaded', () => {
    const materialRequests = [
        {
            reqNo: 'REQ-2026-1052', project: 'Site Alpha', pic: 'Shaira Hadid', date: '2026-07-20', status: 'Pending', comment: '',
            items: [
                { name: 'Portland Cement Type 1', category: 'Masonry', qty: 450, unit: 'Bags' },
                { name: 'Deformed Rebar 16mm x 6m', category: 'Metals', qty: 1200, unit: 'Pieces' },
                { name: 'Marine Plywood 3/4"', category: 'Woodwork', qty: 120, unit: 'Sheets' }
            ]
        },
        {
            reqNo: 'REQ-2026-1051', project: 'Sector 4', pic: 'James Holden', date: '2026-07-19', status: 'Pending', comment: '',
            items: [
                { name: 'PVC Pipe 4" Series 1000', category: 'Plumbing', qty: 85, unit: 'Lengths' },
                { name: 'THHN Copper Wire 3.5mm', category: 'Electrical', qty: 20, unit: 'Rolls' },
                { name: 'Portland Cement Type 1', category: 'Masonry', qty: 200, unit: 'Bags' }
            ]
        },
        {
            reqNo: 'REQ-2026-1048', project: 'Site Beta', pic: 'Amos Burton', date: '2026-07-18', status: 'Approved', comment: 'Approved for urgent structural framing.',
            items: [
                { name: 'Marine Plywood 3/4"', category: 'Woodwork', qty: 150, unit: 'Sheets' },
                { name: 'Structural Timber', category: 'Woodwork', qty: 300, unit: 'Pieces' },
                { name: 'Deformed Rebar 20mm x 6m', category: 'Metals', qty: 250, unit: 'Pieces' }
            ]
        },
        {
            reqNo: 'REQ-2026-1045', project: 'Site Alpha', pic: 'Shaira Hadid', date: '2026-07-16', status: 'Rejected', comment: 'Quantities exceed Q3 budget allocation for Alpha. Review and resubmit.',
            items: [
                { name: 'THHN Copper Wire 3.5mm', category: 'Electrical', qty: 50, unit: 'Rolls' },
                { name: 'PVC Pipe 4" Series 1500', category: 'Plumbing', qty: 75, unit: 'Lengths' },
                { name: 'Phenolic Plywood 3/4"', category: 'Woodwork', qty: 90, unit: 'Sheets' }
            ]
        },
        {
            reqNo: 'REQ-2026-1041', project: 'Sector 4', pic: 'James Holden', date: '2026-07-15', status: 'Approved', comment: '',
            items: [
                { name: 'Ready-Mix Concrete', category: 'Masonry', qty: 25, unit: 'Cubic Meters' },
                { name: 'Deformed Rebar 16mm x 6m', category: 'Metals', qty: 400, unit: 'Pieces' },
                { name: 'Marine Plywood 3/4"', category: 'Woodwork', qty: 80, unit: 'Sheets' }
            ]
        }
    ];

    const substitutionRequests = [
        {
            subNo: 'SUB-2026-0801', sourceRequest: 'REQ-2026-1052', project: 'Site Alpha', pic: 'Shaira Hadid', date: '2026-07-20', status: 'Pending', comment: '',
            reason: 'Supplier stockout on approved materials; alternatives are needed to avoid site delay.',
            notes: 'Both substitutions belong to the same approved material request and should be reviewed together.',
            substitutions: [
                { original: 'Portland Cement Type 1', replacement: 'High Early Strength Cement', qty: 450, unit: 'Bags' },
                { original: 'Deformed Rebar 16mm x 6m', replacement: 'Deformed Rebar 18mm Grade 60', qty: 300, unit: 'Pieces' }
            ]
        },
        {
            subNo: 'SUB-2026-0802', sourceRequest: 'REQ-2026-1051', project: 'Sector 4', pic: 'James Holden', date: '2026-07-19', status: 'Pending', comment: '',
            reason: 'Structural revision requested by the lead structural engineer.',
            notes: 'Replacement requires approval before procurement proceeds.',
            substitutions: [
                { original: 'PVC Pipe 4" Series 1000', replacement: 'HDPE Pipe 4" PN10', qty: 50, unit: 'Lengths' }
            ]
        },
        {
            subNo: 'SUB-2026-0799', sourceRequest: 'REQ-2026-1048', project: 'Site Beta', pic: 'Amos Burton', date: '2026-07-18', status: 'Approved', comment: 'Approved. Forwarded to Purchasing Officer for supplier matching.',
            reason: 'Lead time delay on original electrical specification.',
            notes: 'Equivalent conductor size retained.',
            substitutions: [
                { original: 'THHN Copper Wire 3.5mm', replacement: 'XHHW Copper Wire 3.5mm', qty: 40, unit: 'Rolls' }
            ]
        },
        {
            subNo: 'SUB-2026-0795', sourceRequest: 'REQ-2026-1045', project: 'Site Alpha', pic: 'Shaira Hadid', date: '2026-07-16', status: 'Rejected', comment: 'Phenolic board does not meet moisture rating requirements for Alpha exterior works.',
            reason: 'Cost optimization for formworks.',
            notes: 'Requested replacement was cheaper but did not satisfy the approved material requirement.',
            substitutions: [
                { original: 'Marine Plywood 3/4"', replacement: 'Phenolic Board 3/4"', qty: 100, unit: 'Sheets' }
            ]
        },
        {
            subNo: 'SUB-2026-0790', sourceRequest: 'REQ-2026-1041', project: 'Sector 4', pic: 'James Holden', date: '2026-07-15', status: 'Approved', comment: 'Approved HDPE grade substitute.',
            reason: 'Higher durability needed for underground drainage line.',
            notes: 'Replacement remains within the approved project specification.',
            substitutions: [
                { original: 'PVC Pipe 4" Series 1000', replacement: 'HDPE Pipe 4" PN10', qty: 75, unit: 'Lengths' },
                { original: 'Portland Cement Type 1', replacement: 'Portland Cement High Early Strength', qty: 100, unit: 'Bags' }
            ]
        }
    ];

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const showToast = (title, message, type = 'primary') => {
        if (typeof window.showToast === 'function') window.showToast(title, message, type);
    };

    const openModal = (id) => {
        if (typeof window.openModal === 'function') window.openModal(id);
    };

    const closeModal = (id) => {
        if (typeof window.closeModal === 'function') window.closeModal(id);
    };

    const badgeClass = (status) => {
        if (status === 'Approved') return 'badge-success';
        if (status === 'Rejected') return 'badge-danger';
        return 'badge-warning';
    };

    const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-content[data-tab-content]');

    const activateTab = (name) => {
        tabButtons.forEach((button) => {
            const active = button.dataset.tab === name;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        tabPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.tabContent === name));
    };

    tabButtons.forEach((button) => button.addEventListener('click', () => activateTab(button.dataset.tab)));

    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    if (requestedTab === 'substitution') activateTab('substitution-requests');

    // ---------------------------------------------------------------------
    // Material Requests
    // ---------------------------------------------------------------------
    const materialState = { currentPage: 1, itemsPerPage: 5, filtered: [], activeReqNo: null };
    const materialRefs = {
        body: document.getElementById('materialRequestsBody'),
        search: document.getElementById('materialSearchInput'),
        status: document.getElementById('materialStatusFilter'),
        project: document.getElementById('materialProjectFilter'),
        sort: document.getElementById('materialSortFilter'),
        export: document.getElementById('materialExportBtn'),
        prev: document.getElementById('materialPrevPage'),
        next: document.getElementById('materialNextPage'),
        info: document.getElementById('materialPageInfo')
    };

    const renderMaterialRequests = () => {
        const term = materialRefs.search.value.trim().toLowerCase();
        materialState.filtered = materialRequests.filter((request) => {
            const matchesSearch = [request.reqNo, request.project, request.pic].some((value) => value.toLowerCase().includes(term));
            const matchesStatus = materialRefs.status.value === 'All' || request.status === materialRefs.status.value;
            const matchesProject = materialRefs.project.value === 'All' || request.project === materialRefs.project.value;
            return matchesSearch && matchesStatus && matchesProject;
        });

        materialState.filtered.sort((a, b) => {
            const delta = new Date(b.date) - new Date(a.date);
            return materialRefs.sort.value === 'desc' ? delta : -delta;
        });

        const total = materialState.filtered.length;
        const pages = Math.max(1, Math.ceil(total / materialState.itemsPerPage));
        materialState.currentPage = Math.min(Math.max(1, materialState.currentPage), pages);
        const start = (materialState.currentPage - 1) * materialState.itemsPerPage;
        const rows = materialState.filtered.slice(start, start + materialState.itemsPerPage);

        if (!rows.length) {
            materialRefs.body.innerHTML = '<tr><td colspan="7" class="empty-state-row">No material requests match your criteria.</td></tr>';
            materialRefs.info.textContent = 'Showing 0 to 0 of 0 requests';
        } else {
            materialRefs.body.innerHTML = rows.map((request) => {
                const actionButtons = [`<button type="button" class="action-btn" data-material-action="view" data-id="${escapeHtml(request.reqNo)}" title="View Details"><i class="fas fa-eye"></i></button>`];
                if (request.status === 'Pending') {
                    actionButtons.push(`<button type="button" class="action-btn edit" data-material-action="approve" data-id="${escapeHtml(request.reqNo)}" title="Approve Request"><i class="fas fa-check-circle"></i></button>`);
                    actionButtons.push(`<button type="button" class="action-btn delete" data-material-action="reject" data-id="${escapeHtml(request.reqNo)}" title="Reject Request"><i class="fas fa-times-circle"></i></button>`);
                }
                return `
                    <tr>
                        <td><strong>${escapeHtml(request.reqNo)}</strong></td>
                        <td>${escapeHtml(request.project)}</td>
                        <td>${escapeHtml(request.pic)}</td>
                        <td>${escapeHtml(request.date)}</td>
                        <td class="font-semibold">${request.items.length}</td>
                        <td><span class="badge ${badgeClass(request.status)}">${escapeHtml(request.status)}</span></td>
                        <td class="text-right"><div class="gm-request-actions">${actionButtons.join('')}</div></td>
                    </tr>`;
            }).join('');
            materialRefs.info.textContent = `Showing ${start + 1} to ${Math.min(start + rows.length, total)} of ${total} requests`;
        }

        materialRefs.prev.disabled = materialState.currentPage <= 1;
        materialRefs.next.disabled = materialState.currentPage >= pages;
    };

    const showMaterialDetails = (id) => {
        const request = materialRequests.find((item) => item.reqNo === id);
        if (!request) return;
        document.getElementById('materialDetailsRequestBadge').textContent = request.reqNo;
        document.getElementById('materialDetailsProject').textContent = request.project;
        document.getElementById('materialDetailsPic').textContent = request.pic;
        document.getElementById('materialDetailsItemsBody').innerHTML = request.items.map((item) => `
            <tr><td>${escapeHtml(item.name)}</td><td><span class="badge badge-info">${escapeHtml(item.category)}</span></td><td>${Number(item.qty).toLocaleString()}</td><td>${escapeHtml(item.unit)}</td></tr>`).join('');
        const wrapper = document.getElementById('materialDetailsCommentWrapper');
        wrapper.classList.toggle('is-hidden', !request.comment);
        document.getElementById('materialDetailsComment').textContent = request.comment || '';
        openModal('materialDetailsModal');
    };

    materialRefs.body.addEventListener('click', (event) => {
        const button = event.target.closest('[data-material-action]');
        if (!button) return;
        materialState.activeReqNo = button.dataset.id;
        if (button.dataset.materialAction === 'view') showMaterialDetails(button.dataset.id);
        if (button.dataset.materialAction === 'approve') {
            document.getElementById('materialApproveRequestNo').textContent = button.dataset.id;
            document.getElementById('materialApproveComment').value = '';
            openModal('materialApproveModal');
        }
        if (button.dataset.materialAction === 'reject') {
            document.getElementById('materialRejectRequestNo').textContent = button.dataset.id;
            document.getElementById('materialRejectReason').value = '';
            document.getElementById('materialRejectReasonGroup').classList.remove('has-error');
            document.getElementById('materialRejectError').style.display = 'none';
            openModal('materialRejectModal');
        }
    });

    [materialRefs.search, materialRefs.status, materialRefs.project, materialRefs.sort].forEach((control) => {
        control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change', () => {
            materialState.currentPage = 1;
            renderMaterialRequests();
        });
    });
    materialRefs.prev.addEventListener('click', () => { if (materialState.currentPage > 1) { materialState.currentPage--; renderMaterialRequests(); } });
    materialRefs.next.addEventListener('click', () => { materialState.currentPage++; renderMaterialRequests(); });
    materialRefs.export.addEventListener('click', () => showToast('Report Export Initiated', 'Generating the material request report...', 'primary'));

    document.getElementById('materialConfirmApproveBtn').addEventListener('click', () => {
        const request = materialRequests.find((item) => item.reqNo === materialState.activeReqNo);
        if (!request) return;
        request.status = 'Approved';
        request.comment = document.getElementById('materialApproveComment').value.trim();
        closeModal('materialApproveModal');
        renderMaterialRequests();
        showToast('Material Request Approved', `${request.reqNo} was approved and released for procurement.`, 'success');
    });

    document.getElementById('materialConfirmRejectBtn').addEventListener('click', () => {
        const reason = document.getElementById('materialRejectReason').value.trim();
        if (!reason) {
            document.getElementById('materialRejectReasonGroup').classList.add('has-error');
            document.getElementById('materialRejectError').style.display = 'block';
            return;
        }
        const request = materialRequests.find((item) => item.reqNo === materialState.activeReqNo);
        if (!request) return;
        request.status = 'Rejected';
        request.comment = reason;
        closeModal('materialRejectModal');
        renderMaterialRequests();
        showToast('Material Request Rejected', `${request.reqNo} was rejected.`, 'danger');
    });

    // ---------------------------------------------------------------------
    // Substitution Requests
    // ---------------------------------------------------------------------
    const substitutionState = { currentPage: 1, itemsPerPage: 5, filtered: [], activeSubNo: null };
    const substitutionRefs = {
        body: document.getElementById('substitutionRequestsBody'),
        search: document.getElementById('substitutionSearchInput'),
        status: document.getElementById('substitutionStatusFilter'),
        project: document.getElementById('substitutionProjectFilter'),
        sort: document.getElementById('substitutionSortFilter'),
        export: document.getElementById('substitutionExportBtn'),
        prev: document.getElementById('substitutionPrevPage'),
        next: document.getElementById('substitutionNextPage'),
        info: document.getElementById('substitutionPageInfo')
    };

    const renderSubstitutionRequests = () => {
        const term = substitutionRefs.search.value.trim().toLowerCase();
        substitutionState.filtered = substitutionRequests.filter((request) => {
            const materialText = request.substitutions.flatMap((item) => [item.original, item.replacement]).join(' ').toLowerCase();
            const matchesSearch = [request.subNo, request.sourceRequest, request.project, request.pic, request.reason].some((value) => value.toLowerCase().includes(term)) || materialText.includes(term);
            const matchesStatus = substitutionRefs.status.value === 'All' || request.status === substitutionRefs.status.value;
            const matchesProject = substitutionRefs.project.value === 'All' || request.project === substitutionRefs.project.value;
            return matchesSearch && matchesStatus && matchesProject;
        });

        substitutionState.filtered.sort((a, b) => {
            const delta = new Date(b.date) - new Date(a.date);
            return substitutionRefs.sort.value === 'desc' ? delta : -delta;
        });

        const total = substitutionState.filtered.length;
        const pages = Math.max(1, Math.ceil(total / substitutionState.itemsPerPage));
        substitutionState.currentPage = Math.min(Math.max(1, substitutionState.currentPage), pages);
        const start = (substitutionState.currentPage - 1) * substitutionState.itemsPerPage;
        const rows = substitutionState.filtered.slice(start, start + substitutionState.itemsPerPage);

        if (!rows.length) {
            substitutionRefs.body.innerHTML = '<tr><td colspan="8" class="empty-state-row">No substitution requests match your criteria.</td></tr>';
            substitutionRefs.info.textContent = 'Showing 0 to 0 of 0 requests';
        } else {
            substitutionRefs.body.innerHTML = rows.map((request) => {
                const actions = [`<button type="button" class="action-btn" data-substitution-action="view" data-id="${escapeHtml(request.subNo)}" title="View Details"><i class="fas fa-eye"></i></button>`];
                if (request.status === 'Pending') {
                    actions.push(`<button type="button" class="action-btn edit" data-substitution-action="approve" data-id="${escapeHtml(request.subNo)}" title="Approve Request"><i class="fas fa-check-circle"></i></button>`);
                    actions.push(`<button type="button" class="action-btn delete" data-substitution-action="reject" data-id="${escapeHtml(request.subNo)}" title="Reject Request"><i class="fas fa-times-circle"></i></button>`);
                }
                const summary = request.substitutions.length === 1 ? '1 material' : `${request.substitutions.length} materials`;
                return `
                    <tr>
                        <td><strong>${escapeHtml(request.subNo)}</strong></td>
                        <td>${escapeHtml(request.sourceRequest)}</td>
                        <td>${escapeHtml(request.project)}</td>
                        <td>${escapeHtml(request.pic)}</td>
                        <td>${escapeHtml(request.date)}</td>
                        <td><span class="badge badge-info">${escapeHtml(summary)}</span></td>
                        <td><span class="badge ${badgeClass(request.status)}">${escapeHtml(request.status)}</span></td>
                        <td class="text-right"><div class="gm-request-actions">${actions.join('')}</div></td>
                    </tr>`;
            }).join('');
            substitutionRefs.info.textContent = `Showing ${start + 1} to ${Math.min(start + rows.length, total)} of ${total} requests`;
        }

        substitutionRefs.prev.disabled = substitutionState.currentPage <= 1;
        substitutionRefs.next.disabled = substitutionState.currentPage >= pages;
    };

    const showSubstitutionDetails = (id) => {
        const request = substitutionRequests.find((item) => item.subNo === id);
        if (!request) return;
        document.getElementById('substitutionDetailsRequestBadge').textContent = request.subNo;
        document.getElementById('substitutionDetailsSource').textContent = request.sourceRequest;
        document.getElementById('substitutionDetailsProject').textContent = request.project;
        document.getElementById('substitutionDetailsPic').textContent = request.pic;
        document.getElementById('substitutionDetailsDate').textContent = request.date;
        document.getElementById('substitutionDetailsReason').textContent = request.reason;
        document.getElementById('substitutionDetailsNotes').textContent = request.notes;
        document.getElementById('substitutionDetailsItemsBody').innerHTML = request.substitutions.map((item) => `
            <tr><td>${escapeHtml(item.original)}</td><td class="font-semibold">${escapeHtml(item.replacement)}</td><td>${Number(item.qty).toLocaleString()}</td><td>${escapeHtml(item.unit)}</td></tr>`).join('');
        const wrapper = document.getElementById('substitutionDetailsCommentWrapper');
        wrapper.classList.toggle('is-hidden', !request.comment);
        document.getElementById('substitutionDetailsComment').textContent = request.comment || '';
        openModal('substitutionDetailsModal');
    };

    substitutionRefs.body.addEventListener('click', (event) => {
        const button = event.target.closest('[data-substitution-action]');
        if (!button) return;
        substitutionState.activeSubNo = button.dataset.id;
        if (button.dataset.substitutionAction === 'view') showSubstitutionDetails(button.dataset.id);
        if (button.dataset.substitutionAction === 'approve') {
            document.getElementById('substitutionApproveRequestNo').textContent = button.dataset.id;
            document.getElementById('substitutionApproveComment').value = '';
            openModal('substitutionApproveModal');
        }
        if (button.dataset.substitutionAction === 'reject') {
            document.getElementById('substitutionRejectRequestNo').textContent = button.dataset.id;
            document.getElementById('substitutionRejectReason').value = '';
            document.getElementById('substitutionRejectReasonGroup').classList.remove('has-error');
            document.getElementById('substitutionRejectError').style.display = 'none';
            openModal('substitutionRejectModal');
        }
    });

    [substitutionRefs.search, substitutionRefs.status, substitutionRefs.project, substitutionRefs.sort].forEach((control) => {
        control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change', () => {
            substitutionState.currentPage = 1;
            renderSubstitutionRequests();
        });
    });
    substitutionRefs.prev.addEventListener('click', () => { if (substitutionState.currentPage > 1) { substitutionState.currentPage--; renderSubstitutionRequests(); } });
    substitutionRefs.next.addEventListener('click', () => { substitutionState.currentPage++; renderSubstitutionRequests(); });
    substitutionRefs.export.addEventListener('click', () => showToast('Report Export Initiated', 'Generating the substitution request report...', 'primary'));

    document.getElementById('substitutionConfirmApproveBtn').addEventListener('click', () => {
        const request = substitutionRequests.find((item) => item.subNo === substitutionState.activeSubNo);
        if (!request) return;
        request.status = 'Approved';
        request.comment = document.getElementById('substitutionApproveComment').value.trim();
        closeModal('substitutionApproveModal');
        renderSubstitutionRequests();
        showToast('Substitution Request Approved', `${request.subNo} was approved as one request for ${request.sourceRequest}.`, 'success');
    });

    document.getElementById('substitutionConfirmRejectBtn').addEventListener('click', () => {
        const reason = document.getElementById('substitutionRejectReason').value.trim();
        if (!reason) {
            document.getElementById('substitutionRejectReasonGroup').classList.add('has-error');
            document.getElementById('substitutionRejectError').style.display = 'block';
            return;
        }
        const request = substitutionRequests.find((item) => item.subNo === substitutionState.activeSubNo);
        if (!request) return;
        request.status = 'Rejected';
        request.comment = reason;
        closeModal('substitutionRejectModal');
        renderSubstitutionRequests();
        showToast('Substitution Request Rejected', `${request.subNo} was rejected.`, 'danger');
    });

    renderMaterialRequests();
    renderSubstitutionRequests();
});
