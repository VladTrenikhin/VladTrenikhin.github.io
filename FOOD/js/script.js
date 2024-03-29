window.addEventListener('DOMContentLoaded', function() {

    // Tabs
    
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
    });
    
    // Timer

    const deadline = '2022-12-11';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor( (t/(1000*60*60*24)) ),
            seconds = Math.floor( (t/1000) % 60 ),
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60) % 24) );

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { 
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 300000);
    // Изменил значение, чтобы не отвлекало

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для создание карточек меню

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResource("http://localhost:3000/menu")
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
    //     });
    // });

axios.get("http://localhost:3000/menu")
.then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
        });
    });
    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {   //await позволяет дождаться результатов запроса
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
        
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
    fetch('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));

    //slider
    const slide = document.querySelectorAll('.offer__slide'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        next = document.querySelector('.offer__slider-next'),
        prev = document.querySelector('.offer__slider-prev'),
        slider = document.querySelector('.offer__slider'),
        wrapper = document.createElement('ol');
    let leng = slide.length,
        i = 1,
        dots = [];

    slider.style.position = 'relative';
    wrapper.classList.add('carousel-indicators');


    document.querySelector('.offer__slider').append(wrapper);
    
    for(i = 0; i < leng; i++) {
        const dot = document.createElement('li');
        dot.classList.add('dot');
        wrapper.append(dot);
        dot.setAttribute('data-slide-to', i + 1);
        dots.push(dot);
    }

    const activeDot = document.querySelectorAll('.dot');

      function hideSlide() { 
        slide.forEach(item => {
            item.classList.add('hide');
        });
    };
      function dotsOpacityDef() {
        activeDot.forEach(item => {
            item.style.cssText =  'opacity: .5;';
        });
      }
    

   
    activeDot[0].style.cssText = 'opacity: 1.0;';
    hideSlide();

    total.textContent =`0${leng}`;
    slide[0].classList.remove('hide');
    current.textContent = `01`;
    next.addEventListener('click', () => {
        if (i >= leng) {
            i = 0;
        }
        i++;
        current.textContent = `0${i}`;
        hideSlide();
        dotsOpacityDef();
        slide[i-1].classList.remove('hide');
        activeDot[i-1].style.cssText = 'opacity: 1.0;';
    });
        
    prev.addEventListener('click', () => {
        if (i == 1){
            i = leng + 1;
        }
        i--;
        current.textContent = `0${i}`;
        hideSlide();
        dotsOpacityDef();
        slide[i-1].classList.remove('hide');
        activeDot[i-1].style.cssText = 'opacity: 1.0;';
    });

    
    activeDot.forEach(dot => {
            dot.addEventListener('click', (e) => {
                hideSlide();
                dotsOpacityDef();
                const slideof = e.target.getAttribute('data-slide-to');
                i = slideof;
                slide[i-1].classList.remove('hide');
                activeDot[i-1].style.cssText = 'opacity: 1.0;';
                current.textContent = `0${i}`;
            
        });
    });
    
    //calc
    const gender = document.querySelector('#gender'),
          culcBtn = gender.querySelectorAll('.calculating__choose-item'),
          age = document.querySelector('#age'),
          weight = document.querySelector('#weight'),
          height = document.querySelector('#height'),
          activity = document.querySelector('.calculating__choose_big'),
          activityIndex = activity.querySelectorAll('.calculating__choose-item');
          calc = document.querySelector('.calculating__result');

    let index = [0, 0, 0, 0],
        indexOfActiv = [1.2, 1.375, 1.55, 1.725],
        BMR = 0;
        result = calc.querySelector('span');

    function activeRemove (e) {
        e.forEach(item => {
        item.classList.remove('calculating__choose-item_active');
        });
    }
    activeRemove(culcBtn);
    activeRemove(activityIndex);

    for (i = 0; i <= 3; i++) {
        activityIndex[i].setAttribute('num', i);
    }

    gender.addEventListener('click', (e) => {
        activeRemove(culcBtn);
        activeRemove(activityIndex);
        e.target.classList.add('calculating__choose-item_active');
        if (e.target.innerText == 'Женщина') {
            index = [447.6, 13.4, 4.8, 5.7];
        } else {
            index = [88.36, 9.2, 3.1, 4.3];
        }
        result.innerHTML = `<span>0</span>`;
        
    });
    
    activity.addEventListener('click', (event) => {
        activeRemove(activityIndex);
        event.target.classList.add('calculating__choose-item_active');
        let n = event.target.getAttribute('num');
        BMR = Math.round((index[0] + index[1] * weight.value + index[2] * height.value - index[3] * age.value) * indexOfActiv[n]);
        result.innerHTML = `<span>${BMR}</span>`;
    });

});

