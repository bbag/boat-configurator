document.body.scrollTop = 0
document.documentElement.scrollTop = 0

// Import Dopple
import { DoppleXR } from 'https://builds.dopple.io/packages/dopple-sdk@latest/dopple-sdk.js'

// Define a default selection
const defaultSelection = {
    bimini_top: 'hidden',
    bimini_top_color: 'white',
    console_color: 'white',
    deck_color: 'white',
    gunwale_color: 'white',
    hull_bottom_color: 'white',
    hull_side_color: 'white',
    interior_accent_color: 'white',
    interior_primary_color: 'white',
    logo_color: 'white',
    upholstery_primary_color: 'white',
    upholstery_secondary_color: 'white',
    upholstery_trim_color: 'white',
    table: 'hidden',
    table_color: 'white',
    tower_speakers: 'hidden',
    camera_position: 'side-starboard'
}

// Initialize your 3D product
const dopple = new DoppleXR({
    container: document.getElementById('dopple-canvas'),
    owner: 'dopple',
    workspace: 'dopple-demos',
    projectName: 'boat',
    productVersion: '1',
    selection: defaultSelection
})

// Handle loading progress
const progressElement = document.querySelector('.progress')
dopple.loadingManager.onProgress = (_url, current) => {
	const ACTUAL_TOTAL = 62
    progressElement.textContent = `${Math.round((current / ACTUAL_TOTAL) * 100)}%`
}

await dopple.load()

// Hide the loading screen
document.querySelector('.loading-screen').dataset.loaded = 'true'
document.body.dataset.loaded = 'true'

// Set to initial camera position
dopple.controls.setPosition(-9.25, 4.25, 0.85)
dopple.controls.setTarget(1.416, 4.65, 0)

// Run the renderer
dopple.run()

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
            // document.body.style.setProperty('--bg', '#d7eaf2')
            dopple.controls.setPosition(-9.25, 4.25, 0.85, true)
            dopple.controls.setTarget(1.416, 4.65, 0, true)
            dopple.controls.setFocalOffset(0, 0, 0, true)
            break
        case 1:
            // document.body.style.setProperty('--bg', '#c5daea')
            dopple.controls.setPosition(0, 11, -0.5, true)
            dopple.controls.setTarget(0, 0, 0.01, true)
            dopple.controls.setFocalOffset(2.5, 0, 0, true)
            break
        case 2:
            // document.body.style.setProperty('--bg', '#b0c6e5')
            dopple.controls.setPosition(-4.819, 3.987, -5.129, true)
            dopple.controls.setTarget(0.928, 0.659, -0.726, true)
            dopple.controls.setFocalOffset(-2, 0, 0, true)
            break
        case 3:
            // document.body.style.setProperty('--bg', '#a1b6e0')
            dopple.controls.setTarget(0, 4.113, -0.144, true)
            dopple.controls.setPosition(0, 2.08, -6.134, true)
            dopple.controls.setFocalOffset(0, 0, 0, true)
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