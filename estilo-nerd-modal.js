(function() {
    var overlay;
    var dialog;
    var previousActiveElement;

    function getFocusableElements() {
        if (!dialog) return [];

        return Array.prototype.slice.call(dialog.querySelectorAll([
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(','))).filter(function(element) {
            return element.offsetParent !== null || element === document.activeElement;
        });
    }

    function trapFocus(event) {
        if (event.key !== 'Tab' || !overlay || overlay.hidden) return;

        var focusable = getFocusableElements();
        if (!focusable.length) {
            event.preventDefault();
            dialog.focus();
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function setGameAccessibility(active) {
        var shell = document.querySelector('.emulator-shell');
        if (!shell) return;

        if (active) {
            shell.setAttribute('inert', '');
            shell.setAttribute('aria-hidden', 'true');
        } else {
            shell.removeAttribute('inert');
            shell.removeAttribute('aria-hidden');
        }
    }

    function closeModal() {
        if (!overlay) return;

        overlay.hidden = true;
        document.body.classList.remove('estilo-modal-open');
        document.removeEventListener('keydown', trapFocus);
        setGameAccessibility(false);

        if (previousActiveElement && previousActiveElement.focus) {
            previousActiveElement.focus();
        }
    }

    function createModal() {
        if (document.querySelector('.estilo-profile-overlay')) return;

        previousActiveElement = document.activeElement;
        overlay = document.createElement('section');
        overlay.className = 'estilo-profile-overlay';
        overlay.setAttribute('aria-label', 'Apresentação da Estilo Nerd');

        dialog = document.createElement('div');
        dialog.className = 'estilo-profile-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'estilo-profile-title');
        dialog.setAttribute('aria-describedby', 'estilo-profile-bio');
        dialog.setAttribute('tabindex', '-1');

        var avatar = document.createElement('div');
        avatar.className = 'estilo-profile-avatar';
        avatar.setAttribute('aria-hidden', 'true');

        var image = document.createElement('img');
        image.src = '/images/estilo-nerd-avatar.png';
        image.alt = '';
        image.addEventListener('error', function() {
            if (image.getAttribute('src') !== 'images/estilo-nerd-avatar.png') {
                image.src = 'images/estilo-nerd-avatar.png';
                return;
            }

            image.classList.add('is-hidden');
        });
        avatar.appendChild(image);

        var title = document.createElement('h1');
        title.id = 'estilo-profile-title';
        title.className = 'estilo-profile-title';
        title.textContent = 'Estilo Nerd';

        var bio = document.createElement('p');
        bio.id = 'estilo-profile-bio';
        bio.className = 'estilo-profile-bio';
        bio.textContent = 'Impressão 3D, presentes criativos e produtos para quem ama o universo nerd.';

        var actions = document.createElement('div');
        actions.className = 'estilo-profile-actions';

        var instagram = document.createElement('a');
        instagram.className = 'estilo-profile-instagram';
        instagram.href = 'https://www.instagram.com/loja.estilonerd/';
        instagram.target = '_blank';
        instagram.rel = 'noopener noreferrer';
        instagram.textContent = 'Seguir no Instagram';

        var ok = document.createElement('button');
        ok.className = 'estilo-profile-ok';
        ok.type = 'button';
        ok.textContent = 'OK, acessar o jogo';
        ok.addEventListener('click', closeModal);

        actions.appendChild(instagram);
        actions.appendChild(ok);

        dialog.appendChild(avatar);
        dialog.appendChild(title);
        dialog.appendChild(bio);
        dialog.appendChild(actions);
        overlay.appendChild(dialog);
        document.body.insertBefore(overlay, document.body.firstChild);
    }

    function openModal() {
        createModal();

        document.body.classList.add('estilo-modal-open');
        document.addEventListener('keydown', trapFocus);
        setGameAccessibility(true);

        document.addEventListener('DOMContentLoaded', function() {
            if (overlay && !overlay.hidden) {
                setGameAccessibility(true);
            }
        }, { once: true });

        window.setTimeout(function() {
            var focusable = getFocusableElements();
            (focusable[0] || dialog).focus();
        }, 0);
    }

    if (document.body) {
        openModal();
    } else {
        document.addEventListener('DOMContentLoaded', openModal, { once: true });
    }
})();
