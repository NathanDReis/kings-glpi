import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit, AfterViewInit {
    currentPosition = 0;
    items: any[] = [];
    linkGeralLearnMore: any;

    namesForm = [
        'Carlos Azevedo',
        'Maria Silva',
        'João Pereira',
        'Ana Costa',
        'Pedro Santos',
        'Luís Oliveira',
        'Fernanda Rocha',
        'Sofia Martins',
        'Ricardo Almeida',
        'Patrícia Gomes',
        'Tiago Ferreira',
        'Cláudia Dias',
        'Bruno Cardoso',
        'Isabel Moreira',
        'André Sousa',
        'Raquel Pires',
        'Fábio Nunes',
        'Helena Teixeira',
        'Gustavo Lima',
        'Catarina Ribeiro',
        'Vítor Correia',
        'Marta Costa',
        'Sérgio Pinto',
        'Joana Martins',
        'Rui Mendes',
        'Inês Silva',
        'Diogo Araújo',
        'Lúcia Barros',
        'Nuno Carvalho',
        'Sara Rocha',
        'Miguel Costa',
        'Ana Paula',
        'Paulo Martins',
        'Elisabete Santos',
        'Ricardo Silva',
        'João Costa',
        'Mariana Pereira',
        'Tiago Martins',
        'Cláudia Silva',
        'Bruno Costa',
        'Isabel Santos',
        'André Martins',
        'Raquel Costa',
        'Fábio Silva',
        'Helena Martins',
        'Gustavo Santos',
        'Catarina Costa',
        'Vítor Martins',
        'Marta Silva',
        'Sérgio Costa',
        'Joana Silva',
        'Rui Costa',
        'Inês Martins',
        'Diogo Silva',
        'Lúcia Costa',
        'Nuno Silva',
        'Sara Martins',
        'Miguel Silva',
        'Ana Costa',
        'Paulo Silva',
        'Elisabete Costa',
        'Ricardo Costa',
        'João Silva',
        'Mariana Costa',
        'Tiago Silva',
        'Cláudia Costa',
        'Bruno Silva',
        'Isabel Costa',
        'André Silva',
        'Raquel Silva',
        'Fábio Costa',
        'Helena Silva',
        'Gustavo Costa',
        'Catarina Silva',
        'Vítor Costa',
        'Marta Costa',
    ];

    ngOnInit() {
    }

    ngAfterViewInit() {
        initFlowbite();
        this.initCarousel();
        this.initNavigation();
        this.initContactForm();
    }

    initCarousel() {
        console.log('Initializing Carousel');
        this.linkGeralLearnMore = document.querySelector('#link_geral_learn_more');

        this.items = [
            {
                position: 0,
                el: document.getElementById('carousel-item-1')!,
                titles: document.querySelectorAll('.carousel-title-1')!,
                link: '#system-cftv',
            },
            {
                position: 1,
                el: document.getElementById('carousel-item-2')!,
                titles: document.querySelectorAll('.carousel-title-2')!,
                link: '#technology',
            },
            {
                position: 2,
                el: document.getElementById('carousel-item-3')!,
                titles: document.querySelectorAll('.carousel-title-3')!,
                link: '#access-control',
            },
            {
                position: 3,
                el: document.getElementById('carousel-item-4')!,
                titles: document.querySelectorAll('.carousel-title-4')!,
                link: '#suport',
            },
            {
                position: 4,
                el: document.getElementById('carousel-item-5')!,
                titles: document.querySelectorAll('.carousel-title-5')!,
                link: '#personalization',
            },
        ];

        if (this.linkGeralLearnMore && this.items[this.currentPosition]) {
            this.linkGeralLearnMore.href = this.items[this.currentPosition].link;
            this.updateCarousel();
        }
    }

    nextSlide() {
        this.currentPosition += 1;
        if (this.currentPosition >= this.items.length) {
            this.currentPosition = 0;
        }
        this.updateCarousel();
    }

    prevSlide() {
        this.currentPosition -= 1;
        if (this.currentPosition <= -1) {
            this.currentPosition = this.items.length - 1;
        }
        this.updateCarousel();
    }

    updateCarousel() {
        if (!this.items || this.items.length === 0) return;

        this.items.forEach((item) => {
            if (item.el) {
                item.el.classList.remove('flex');
                item.el.classList.add('hidden');
            }
            if (item.titles) {
                item.titles.forEach((title: any) => {
                    title.classList.add('hidden');
                });
            }
        });

        if (this.items[this.currentPosition] && this.items[this.currentPosition].el) {
            this.items[this.currentPosition].el.classList.add('flex');
            this.items[this.currentPosition].el.classList.remove('hidden');

            if (this.items[this.currentPosition].titles) {
                this.items[this.currentPosition].titles.forEach((title: any) => {
                    title.classList.remove('hidden');
                });
            }

            if (this.linkGeralLearnMore) {
                this.linkGeralLearnMore.href = this.items[this.currentPosition].link;
            }
        }
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
        const sections = document.querySelectorAll('article');
        const buttonMenu: any = document.querySelector('#button-menu');

        const removeActiveClasses = () => {
            navLinks.forEach(link => {
                link.classList.remove('text-blue-500', 'dark:text-blue-500');
                link.classList.add('text-gray-900', 'dark:text-white');
            });
        }

        const addActiveClass = (targetId: string) => {
            const activeLink = document.querySelector(`nav ul li a[href="#${targetId}"]`);
            if (!activeLink) return;

            activeLink.classList.remove('text-gray-900', 'dark:text-white');
            activeLink.classList.add('text-blue-500', 'dark:text-blue-500');
        }

        const updateActiveNavigation = () => {
            let currentSection = '';

            sections.forEach((section: any) => {
                const sectionTop = section.offsetTop - 100; // Offset para ativar um pouco antes
                const sectionBottom = sectionTop + section.offsetHeight;
                const scrollPosition = window.pageYOffset;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = section.getAttribute('id')!;
                }
            });

            if (!currentSection) {
                currentSection = 'home';
            }

            removeActiveClasses();
            addActiveClass(currentSection);
        }

        window.addEventListener('scroll', updateActiveNavigation);
        updateActiveNavigation();

        navLinks.forEach((link: any) => {
            (link as HTMLElement).onclick = () => {
                if (window.innerWidth > 768) return;
                if (buttonMenu) buttonMenu.click();
            };
        });
    }

    getRandomName() {
        const randomIndex = Math.floor(Math.random() * this.namesForm.length);
        return this.namesForm[randomIndex];
    }

    initContactForm() {
        const formName = document.querySelector('#form-name') as HTMLInputElement;
        const formEmail = document.querySelector('#form-email') as HTMLInputElement;
        if (formName) {
            const randomName = this.getRandomName();
            formName.placeholder = randomName;
            // Assuming formEmail might not exist or logic was different in original
            // Original: formName.placeholder = randomName;
            // I'll keep it simple as ported
        }
    }

    async copyEmail() {
        const emailButton = document.querySelector('#email-button') as HTMLButtonElement;
        const emailButtonSvgs = emailButton ? emailButton.querySelectorAll('span') as any : []; // Targeting spans as per HTML structure
        try {
            const email = 'atendimentos@mlktecnologia.com.br';
            await navigator.clipboard.writeText(email);

            if (emailButtonSvgs.length > 0) {
                emailButtonSvgs.forEach((svg: any) => svg.classList.toggle('hidden'));
                setTimeout(() => {
                    emailButtonSvgs.forEach((svg: any) => svg.classList.toggle('hidden'));
                }, 1000);
            }

        } catch (error) {
            console.error('Erro ao copiar o e-mail: ', error);
            alert('Erro ao copiar o e-mail. Tente novamente.');
        }
    }

    openWhatsapp() {
        const phoneNumber = '5531992502904';
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        window.open(whatsappUrl, '_blank');
    }
}

