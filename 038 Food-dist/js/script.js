window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__items'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelectorAll('tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none';         //скрываем контент
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsContent.addEventListener('click', (event) => {
        const 
    })

    hideTabContent();
    showTabContent();
});