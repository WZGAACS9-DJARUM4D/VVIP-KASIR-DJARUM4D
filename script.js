$(document).ready(function () {
            /* Tambahkan status dan nama brand otomatis dari teks ALT gambar */
            $(".brand-card").each(function () {
                const brandName = $(this).find("img").attr("alt") || "OFFICIAL";
                const brandKey = brandName.toLowerCase().replace("4d", "");

                $(this).addClass("brand-" + brandKey);
                $(this).find(".brand-logo").wrap('<div class="logo-shell"></div>');

                $(this).append(
                    '<span class="card-grid" aria-hidden="true"></span>' +
                    '<span class="scan-line" aria-hidden="true"></span>' +
                    '<span class="corner-light" aria-hidden="true"></span>' +
                    '<div class="brand-info">' +
                        '<div class="brand-name">' +
                            '<span class="verified-icon">✓</span>' +
                            '<span>' + brandName + '</span>' +
                        '</div>' +
                        '<span class="brand-status">ONLINE • OFFICIAL</span>' +
                    '</div>'
                );
            });

            $(".gameicon").owlCarousel({
                /* Bergerak otomatis ke kiri */
                rtl: false,
                loop: true,

                nav: false,
                dots: false,

                autoplay: true,
                autoplayTimeout: 1600,
                autoplaySpeed: 1000,
                smartSpeed: 1000,
                autoplayHoverPause: false,

                mouseDrag: true,
                touchDrag: true,
                pullDrag: true,

                margin: 10,

                responsive: {
                    0: {
                        items: 2,
                        margin: 4
                    },
                    480: {
                        items: 2,
                        margin: 7
                    },
                    768: {
                        items: 3,
                        margin: 10
                    },
                    992: {
                        items: 3,
                        margin: 12
                    },
                    1200: {
                        items: 3,
                        margin: 12
                    }
                }
            });
        });

function showPage(page){
    const pageFlop = document.getElementById('pageFlop');
    const pageRocket = document.getElementById('pageRocket');

    if(page === 'rocket'){
        pageFlop.classList.remove('active');
        pageRocket.classList.add('active');
        location.hash = 'rumus-wd-diatas-1-juta';
    }else{
        pageRocket.classList.remove('active');
        pageFlop.classList.add('active');
        location.hash = 'rumus-wd-flop';
        setTimeout(function(){
            if(window.jQuery){ $('.owl-carousel.gameicon').trigger('refresh.owl.carousel'); }
        }, 100);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('load', function(){
    if(location.hash === '#rumus-wd-diatas-1-juta'){
        showPage('rocket');
    }else{
        showPage('flop');
    }
});

// Proteksi sederhana: klik kanan, Ctrl+U, dan F12
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e){
    if((e.ctrlKey && e.keyCode === 85) || e.keyCode === 123){
        const message = `
            <html>
                <body style="background:#020617;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;text-align:center;">
                    <div style="padding:30px;border:1px solid #00f6ff;border-radius:22px;box-shadow:0 0 30px rgba(0,246,255,.35);">
                        <h1 style="font-size:3rem;margin:0;text-shadow:0 0 18px #00f6ff;">AKSES DITOLAK</h1>
                        <p style="opacity:.75;">Halaman ini dilindungi.</p>
                    </div>
                </body>
            </html>
        `;
        const win = window.open('', '_blank');
        if(win){
            win.document.write(message);
            win.document.close();
        }
        e.preventDefault();
        return false;
    }
};

/* =======================
   RUMUS WD FLOP
======================= */
function submitData(){
    const inputField = document.getElementById('inputDataFlop');
    const tableBody = document.getElementById('tableBody');
    let rawText = inputField.value.trim();

    tableBody.innerHTML = '';

    if(rawText === ''){
        tableBody.innerHTML = `<tr id="emptyRow"><td colspan="5" class="empty-message">Belum ada data yang dimasukkan.</td></tr>`;
        return;
    }

    const blocks = rawText.split('ACCEPT');
    let dataFound = false;

    blocks.forEach(block => {
        if(block.includes('Withdraw')){
            dataFound = true;

            const parts = block.split('Withdraw');
            const kiriWithdraw = parts[0].trim();
            const kananWithdraw = parts[1].trim();

            const timeMatch = kiriWithdraw.match(/\d{2}:\d{2}:\d{2}/);
            let waktu = '-';
            let userId = '-';

            if(timeMatch){
                waktu = timeMatch[0];
                const indexWaktu = kiriWithdraw.indexOf(waktu);
                userId = kiriWithdraw.substring(indexWaktu + waktu.length).trim();
            }

            const indexMinus = kananWithdraw.lastIndexOf('-');
            let tujuanBank = '-';
            let jumlah = '-';
            let kolomKosong = '';

            if(indexMinus !== -1){
                tujuanBank = kananWithdraw.substring(0, indexMinus).trim();
                jumlah = kananWithdraw.substring(indexMinus + 1).trim();
            }else{
                tujuanBank = kananWithdraw;
            }

            const newRow = document.createElement('tr');
            newRow.setAttribute('data-waktu', waktu);
            newRow.setAttribute('data-userid', userId);
            newRow.setAttribute('data-bank', tujuanBank);
            newRow.setAttribute('data-kosong', kolomKosong);
            newRow.setAttribute('data-jumlah', jumlah);

            newRow.innerHTML = `
                <td>${waktu}</td>
                <td>${userId}</td>
                <td>${tujuanBank}</td>
                <td>${kolomKosong}</td>
                <td class="glow-amount">${jumlah}</td>
            `;

            tableBody.insertBefore(newRow, tableBody.firstChild);
        }
    });

    if(!dataFound){
        tableBody.innerHTML = `<tr id="emptyRow"><td colspan="5" class="empty-message">Format belum lengkap atau belum dikenali.</td></tr>`;
        return;
    }
}

function copyAllTableData(){
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');

    if(rows.length === 0 || document.getElementById('emptyRow')){
        alert('Tidak ada data hasil ekspor yang bisa disalin!');
        return;
    }

    let linesToCopy = [];

    rows.forEach(row => {
        const waktu = row.getAttribute('data-waktu');
        const userId = row.getAttribute('data-userid');
        const bank = row.getAttribute('data-bank');
        const kosong = row.getAttribute('data-kosong');
        const jumlah = row.getAttribute('data-jumlah');

        if(waktu){
            linesToCopy.push(`${waktu}\t${userId}\t${bank}\t${kosong}\t${jumlah}`);
        }
    });

    const textToCopy = linesToCopy.join('\n');

    if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(textToCopy).then(showToast).catch(() => fallbackCopy(textToCopy));
    }else{
        fallbackCopy(textToCopy);
    }
}

function fallbackCopy(text){
    const temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.left = '-9999px';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast();
}

function showToast(pesan = 'Data Siap Ditempel ke Sheet!', tipe = 'success'){
    const toast = document.getElementById('toastNotification');
    toast.innerText = pesan;
    toast.className = tipe === 'error' ? 'toast error' : 'toast';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}

function resetInput(){
    const inputField = document.getElementById('inputDataFlop');
    const tableBody = document.getElementById('tableBody');

    inputField.value = '';
    tableBody.innerHTML = `
        <tr id="emptyRow">
            <td colspan="5" class="empty-message">Belum ada data yang dimasukkan.</td>
        </tr>
    `;
    inputField.focus();
}

/* =======================
   RUMUS WD DI ATAS 1 JUTA
======================= */
function tampilNotif(pesan, tipe = "success") {
    showToast(pesan, tipe);
}

function ubahNominalKeAngka(nominal) {
    return parseInt(String(nominal).replace(/[^\d]/g, ""), 10) || 0;
}

function formatAngkaIndonesia(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function ambilMinimalNominal() {
    const inputMinimal = document.getElementById("minimalNominal").value;
    return ubahNominalKeAngka(inputMinimal);
}

function inputMinimalBerubah() {
    const input = document.getElementById("minimalNominal");
    input.value = input.value.replace(/[^\d.,]/g, "");
    prosesData(false);
}

function rapikanMinimalInput() {
    const input = document.getElementById("minimalNominal");
    const angka = ubahNominalKeAngka(input.value);

    if (angka <= 0) {
        input.value = "1.000.000";
    } else {
        input.value = formatAngkaIndonesia(angka);
    }
}

function updateTotal(jumlah) {
    document.getElementById("totalTerurai").innerText = jumlah;
}

function tampilKosong(pesan = "Belum ada data yang diproses") {
    const tbody = document.getElementById("hasilBody");

    tbody.innerHTML = `
        <tr>
            <td colspan="3" class="empty-row">${pesan}</td>
        </tr>
    `;
}

function prosesData(rapikanInput = true) {
    const input = document.getElementById("inputDataRocket").value.trim();
    const tbody = document.getElementById("hasilBody");
    const minimalNominal = ambilMinimalNominal();

    tbody.innerHTML = "";
    updateTotal(0);
    if (rapikanInput) rapikanMinimalInput();

    if (minimalNominal <= 0) {
        tampilKosong();
        return;
    }

    if (input === "") {
        tampilKosong();
        return;
    }

    const lines = input.split(/\n/);
    let currentId = "";
    let jumlahTerurai = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        const idMatch = line.match(/^\d+\s+([a-zA-Z0-9_]+)/);

        if (idMatch) {
            currentId = idMatch[1];
            continue;
        }

        const wdMatch = line.match(/^Withdraw\s+\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+([\d.,]+)\s+\d+/i);

        if (wdMatch && currentId !== "") {
            const nominalText = wdMatch[1];
            const nominalAngka = ubahNominalKeAngka(nominalText);

            if (nominalAngka >= minimalNominal) {
                const tr = document.createElement("tr");
                tr.className = "baris-animasi";

                const tdId = document.createElement("td");
                const tdNominal = document.createElement("td");
                const tdKet = document.createElement("td");

                tdId.innerText = currentId;
                tdNominal.innerText = nominalText;
                tdNominal.className = "glow-amount";
                tdKet.innerHTML = `<span class="ket-badge">WD</span>`;

                tr.appendChild(tdId);
                tr.appendChild(tdNominal);
                tr.appendChild(tdKet);

                tbody.appendChild(tr);
                jumlahTerurai++;
            }

            currentId = "";
        }
    }

    updateTotal(jumlahTerurai);

    if (jumlahTerurai === 0) {
        tampilKosong("Tidak ada WD sesuai minimal yang kamu tentukan");
    }
}

function salinData() {
    const rows = document.querySelectorAll("#hasilBody tr");
    let hasilSalin = "";

    rows.forEach(function(row) {
        const cells = row.querySelectorAll("td");

        if (cells.length === 3 && !cells[0].hasAttribute("colspan")) {
            hasilSalin += 
                cells[0].innerText.trim() + " " +
                cells[1].innerText.trim() + " " +
                "WD" + "\n";
        }
    });

    hasilSalin = hasilSalin.trim();

    if (hasilSalin === "") {
        tampilNotif("Belum ada data yang bisa disalin", "error");
        return;
    }

    if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(hasilSalin).then(function() {
            tampilNotif("Data Siap Ditempel ke Rocket Chat!");
        }).catch(function() {
            fallbackSalinRocket(hasilSalin);
        });
    }else{
        fallbackSalinRocket(hasilSalin);
    }
}

function fallbackSalinRocket(text){
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    tampilNotif("Data Siap Ditempel ke Rocket Chat!");
}

function resetData() {
    document.getElementById("inputDataRocket").value = "";
    document.getElementById("minimalNominal").value = "1.000.000";
    updateTotal(0);
    tampilKosong();
    tampilNotif("Data sudah direset");
}

// Pecah teks tombol reset per huruf agar efek glitch bergerak bergantian.
document.querySelectorAll('.btn-reset, .reset-btn').forEach(function(button){
    const text = button.textContent.trim();
    button.setAttribute('aria-label', text);
    button.innerHTML = Array.from(text).map(function(character, index){
        const safeCharacter = character === ' ' ? '&nbsp;' : character;
        return '<span class="letter" aria-hidden="true" style="--letter-index:' + index + '">' + safeCharacter + '</span>';
    }).join('');
});

// Uraikan otomatis setiap kali data diketik atau ditempel.
document.getElementById('inputDataFlop').addEventListener('input', submitData);
document.getElementById('inputDataRocket').addEventListener('input', prosesData);

// Jalankan ulang animasi surge pada setiap klik tombol.
document.addEventListener('click', function(event){
    const button = event.target.closest('button');
    if(!button) return;

    button.classList.remove('button-surge');
    void button.offsetWidth;
    button.classList.add('button-surge');

    setTimeout(function(){
        button.classList.remove('button-surge');
    }, 560);
});
