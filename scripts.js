document.body.scrollTop = 0
document.documentElement.scrollTop = 0

const backdropItems = document.querySelectorAll('.backdrop-item')
const sections = document.querySelectorAll('.section')

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const smoother = ScrollSmoother.create({
    wrapper: '#scroll-wrapper',
    content: '#scroll-content',
    smooth: 2,
    effects: true,
    smoothTouch: 0.1,
    normalizeScroll: true
})

let currentSection = 0

function handleSectionEnter(sectionIndex) {
    const prevSection = currentSection
    currentSection = sectionIndex

    // console.log('scrolled to section index ' + currentSection + ' from ' + prevSection)
    console.log(`${prevSection} -> ${currentSection}`)

    // document.querySelectorAll('.progress-dot').forEach((dot, index) => {
    //     dot.classList.toggle('active', index === sectionIndex)
    // })

    backdropItems.forEach((backdrop, index) => {
        if (index < sectionIndex) {
            backdrop.classList.add('inactive-before')
        } else if (index > sectionIndex) {
            backdrop.classList.add('inactive-after')
        } else {
            backdrop.classList.remove('inactive-before')
            backdrop.classList.remove('inactive-after')
        }
    })

    switch (sectionIndex) {
        case 0:
            document.body.style.setProperty('--bg', '#d7eaf2')
            break
        case 1:
            document.body.style.setProperty('--bg', '#c5daea')
            break
        case 2:
            document.body.style.setProperty('--bg', '#b0c6e5')
            break
        case 3:
            document.body.style.setProperty('--bg', '#a1b6e0')
            break
    }
}

function initializePage() {
    sections.forEach((section, index) => {
        const content = section.querySelector('.section-content')
        const heading = section.querySelector('.section-heading')
        const side = section.querySelector('[data-side]')?.dataset.side

        switch (side) {
            case 'left':
                console.log('found a left section')
                break
            case 'right':
                console.log('found a left section')
            default:
                console.log('found a section with no side')
                break
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 60%',
                end: 'bottom 40%',
                toggleActions: 'play none none reverse'
            }
        })

        tl.fromTo(
            heading,
            {
                y: '100%',
                opacity: 0
            },
            {
                y: '0%',
                opacity: 1,
                duration: 1.5,
                ease: 'power3.out',
                delay: 0.25,
                stagger: {
                    amount: 0.6,
                    from: 'start'
                }
            }
        )

        tl.fromTo(
            content.querySelector('p'),
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: 'power3.out',
                stagger: 0.6
            },
            '-=1.1' // Start slightly before headings finish
        )

        if (content.querySelector('.cta')) {
            // Then animate the rest of the content
            tl.fromTo(
                content.querySelector('.cta'),
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: 'power3.out',
                    stagger: 0.6
                },
                '-=1.1' // Start slightly before paragraphs finish
            )
        }

        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => handleSectionEnter(index),
            onEnterBack: () => handleSectionEnter(index)
        })

        const sectionNavButton = section.querySelector('button[data-target]')
        if (sectionNavButton) {
            sectionNavButton.addEventListener('click', () => {
                const targetSection = document.querySelector(sectionNavButton.dataset.target)
                smoother.scrollTo(targetSection, true, 'power3.inOut')
            })
        }
    })
}

// document.querySelectorAll('.progress-dot').forEach((dot, index) => {
//     dot.addEventListener('click', () => {
//         const targetSection = document.querySelector(`[data-section="${index}"]`)
//         smoother.scrollTo(targetSection, true, 'power3.inOut')
//     })
// })

document.addEventListener('DOMContentLoaded', () => {
    initializePage()
    handleSectionEnter(0)
})

window.addEventListener('load', () => {
    ScrollTrigger.refresh()
})
