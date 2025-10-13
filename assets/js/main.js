document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('#mainNavbar');

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

/*
  Máscaras melhores para CPF, Telefone e CEP.
  - Trata colagem (paste)
  - Limita dígitos
  - Formata dinamicamente o telefone para 10 ou 11 dígitos
  - Mantém comportamento compatível com validação HTML existente
*/

function somenteDigitos(str) {
    return (str || '').replace(/\D/g, '');
  }
  
  function formatCPF(value) {
    const v = somenteDigitos(value).slice(0, 11);
    const parts = [];
    if (v.length > 0) parts.push(v.slice(0, Math.min(3, v.length)));
    if (v.length >= 4) parts.push(v.slice(3, Math.min(6, v.length)));
    if (v.length >= 7) parts.push(v.slice(6, Math.min(9, v.length)));
    let tail = v.length >= 10 ? v.slice(9, 11) : '';
    let masked = parts.join('.');
    if (tail) masked += '-' + tail;
    return masked;
  }
  
  function formatCEP(value) {
    const v = somenteDigitos(value).slice(0, 8);
    if (v.length <= 5) return v;
    return v.slice(0,5) + '-' + v.slice(5);
  }
  
  function formatTelefone(value) {
    const v = somenteDigitos(value).slice(0, 11); // até 11 (DD + 9 dígitos)
    if (v.length <= 2) return v;
    // DDD
    const ddd = v.slice(0,2);
    const rest = v.slice(2);
    if (rest.length <= 4) {
      return `(${ddd}) ${rest}`;
    }
    if (rest.length <= 8) {
      // formato (##) 0000-0000
      return `(${ddd}) ${rest.slice(0,4)}-${rest.slice(4)}`;
    }
    // formato (##) 00000-0000 para 9 dígitos locais
    return `(${ddd}) ${rest.slice(0,5)}-${rest.slice(5,9)}`;
  }
  
  function aplicarMascaraElemento(el, formatFn) {
    if (!el) return;
    // ao digitar
    el.addEventListener('input', (e) => {
      const pos = el.selectionStart;
      const oldLength = el.value.length;
      const newVal = formatFn(el.value);
      el.value = newVal;
      // posiciona cursor no fim (solução simples e estável)
      el.setSelectionRange(el.value.length, el.value.length);
    });
  
    // ao colar (garante limpeza)
    el.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      const cleaned = somenteDigitos(paste);
      el.value = formatFn(cleaned);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
  
    // ao perder o foco (opcional: validações adicionais podem ser feitas aqui)
    el.addEventListener('blur', () => {
      // mantém formatado; se quiser validar e limpar em caso inválido, faça aqui
    });
  }
  
  // Aplica às entradas existentes no DOM
  document.addEventListener('DOMContentLoaded', () => {
    aplicarMascaraElemento(document.getElementById('cpf'), formatCPF);
    aplicarMascaraElemento(document.getElementById('telefone'), formatTelefone);
    aplicarMascaraElemento(document.getElementById('cep'), formatCEP);
  
    // Manter validação nativa no submit (mesmo comportamento anterior)
    const form = document.getElementById('form-voluntario');
    if (form) {
      form.addEventListener('submit', (e) => {
        if (!form.checkValidity()) {
          e.preventDefault();
          // Usar reportValidity para destacar campos inválidos em vez de alert bruto
          form.reportValidity();
        } else {
          e.preventDefault(); // simula envio
          alert('Cadastro enviado com sucesso! Obrigado por se voluntariar!');
          form.reset();
        }
      });
    }
  });