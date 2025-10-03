document.body.scrollTop = 0
document.documentElement.scrollTop = 0

import { DoppleXR } from 'https://builds.dopple.io/packages/dopple-sdk@alpha/dopple-sdk.js'

const dopple = new DoppleXR({
    container: document.getElementById('dopple-canvas'),
    owner: 'dopple',
    workspace: 'Glenns-Sandbox',
    projectName: 'scout670',
    productVersion: '1',
    selection: {}
})

// Handle loading progress
const progressElement = document.querySelector('.progress')
dopple.loadingManager.onProgress = (_url, current) => {
	const ACTUAL_TOTAL = 178
    progressElement.textContent = `${Math.round((current / ACTUAL_TOTAL) * 100)}%`
}

await dopple.load()

// Hide the loading screen
// document.querySelector('.loading-screen').dataset.loaded = 'true'
document.body.dataset.loaded = 'true'

// Run the renderer
dopple.run()

// Set to initial camera position
setTimeout(() => {
    console.log('Setting initial position')
    dopple.controls.setPosition(-256, 350, 900, true)
    dopple.controls.setTarget(-270, 120, 0, true)
    dopple.controls.zoomTo(2.25, true)
}, 2500)
// dopple.controls.setPosition(-270, 180, 480)
// dopple.controls.setTarget(-270, 180, 0)
// dopple.controls.setFocalOffset(0, 0, 0)

/*
console.log(dopple.controls.getPosition(), dopple.controls.getTarget())

dopple.controls.setPosition(-270, 180, 480)
dopple.controls.setTarget(-270, 180, 0)

dopple.controls.getPosition()
dopple.controls.getTarget()
*/

// Add Dopple to the window, just for easy peasy debugging
window.dopple = dopple

// GSAP
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
            console.log('section 0')
            dopple.controls.setPosition(-256, 350, 900, true)
            dopple.controls.setTarget(-270, 120, 0, true)
            // document.body.style.setProperty('--bg', '#d7eaf2')
            // dopple.controls.setPosition(-270, 180, 480, true)
            // dopple.controls.setTarget(-270, 180, 0, true)
            // dopple.controls.setFocalOffset(0, 0, 0, true)
            break
        case 1:
            console.log('section 1')
            dopple.controls.setPosition(304, 158, 114, true)
            dopple.controls.setTarget(-251, 13, -137, true)
            // document.body.style.setProperty('--bg', '#c5daea')
            // dopple.controls.setPosition(0, 11, -0.5, true)
            // dopple.controls.setTarget(0, 0, 0.01, true)
            // dopple.controls.setFocalOffset(2.5, 0, 0, true)
            break
        case 2:
            console.log('section 2')
            dopple.controls.setPosition(219, 143, -164, true)
            dopple.controls.setTarget(-213, 5, 172, true)
            // document.body.style.setProperty('--bg', '#b0c6e5')
            // dopple.controls.setPosition(-4.819, 3.987, -5.129, true)
            // dopple.controls.setTarget(0.928, 0.659, -0.726, true)
            // dopple.controls.setFocalOffset(-2, 0, 0, true)
            break
        case 3:
            console.log('section 3')
            dopple.controls.setPosition(226, 179.5, 0, true)
            dopple.controls.setTarget(-209, -87, 0, true)
            // document.body.style.setProperty('--bg', '#a1b6e0')
            // dopple.controls.setTarget(0, 4.113, -0.144, true)
            // dopple.controls.setPosition(0, 2.08, -6.134, true)
            // dopple.controls.setFocalOffset(0, 0, 0, true)
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

initializePage()
handleSectionEnter(0)
ScrollTrigger.refresh()

// document.querySelectorAll('.progress-dot').forEach((dot, index) => {
//     dot.addEventListener('click', () => {
//         const targetSection = document.querySelector(`[data-section="${index}"]`)
//         smoother.scrollTo(targetSection, true, 'power3.inOut')
//     })
// })

// document.addEventListener('DOMContentLoaded', () => {
//     initializePage()
//     handleSectionEnter(0)
// })

// window.addEventListener('load', () => {
//     ScrollTrigger.refresh()
// })

const startConfigButton = document.querySelector('#start-config-button')
if (startConfigButton) {
    startConfigButton.addEventListener('click', () => {
        document.body.dataset.configActive = 'true'
        ScrollTrigger.disable()

        dopple.controls.setPosition(261, 185, 527, true)
        dopple.controls.setTarget(-255, 44, 0, true)


        // dopple.updateSelection({'camera_position': 'free-cam'})

        // const hotspots = document.querySelectorAll('[data-hotspot]')
        // for (const hotspot of hotspots) {
        //     const hotspotId = hotspot.dataset.hotspot
        //     dopple.matrix.hotspots[hotspotId].element = hotspot
        // }
        // dopple.updateSelection()
    })
}