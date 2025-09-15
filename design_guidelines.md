# Tap4Impact Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern donation platforms like GoFundMe and charity websites, with clean, trustworthy aesthetics that emphasize transparency and impact.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Primary Brand: 142 69% 58% (agricultural green)
- Trust Accent: 200 89% 47% (professional blue)
- Success: 142 76% 36% (darker green for progress)

**Supporting Colors:**
- Background Light: 0 0% 98%
- Background Dark: 220 13% 18%
- Text Primary: 220 9% 46%
- Border: 220 13% 91%

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, modern sans-serif
- **Display Font**: Inter with increased letter-spacing for headings
- **Hierarchy**: 
  - Hero: text-5xl font-bold
  - Section headers: text-3xl font-semibold
  - Body: text-base leading-relaxed

### Layout System
**Spacing Units**: Consistent use of Tailwind units 4, 8, 12, 16
- Sections: py-16 px-8
- Components: p-8, gap-8
- Fine details: p-4, gap-4

### Component Library
**Navigation**: Simple, transparent header with logo and donation CTA
**Cards**: Elevated white cards with subtle shadows for project showcases
**Buttons**: 
- Primary: Solid green with white text
- Secondary: Outline variant with blurred background when over images
**Progress Bars**: Animated donation progress indicators
**Stats Display**: Large, prominent donation counters with currency formatting

## Visual Treatment

### Gradients & Backgrounds
- Hero gradient: Subtle green to blue gradient overlay (142 69% 58% to 200 89% 47%)
- Section backgrounds: Alternating white and light gray (0 0% 98%)
- Card treatments: Clean white with soft drop shadows

### Content Strategy
**5-Section Maximum**:
1. **Hero**: Donation totals, impact stats, primary CTA
2. **About Agri Securitas**: Mission and trust-building content
3. **How It Works**: Tap-to-give process explanation with QR integration
4. **Projects Impact**: Visual showcase of funded projects
5. **Footer**: Partnership information and secondary navigation

## Images
**Hero Image**: Large agricultural landscape showing South African farming community (full-width hero background)
**Project Images**: Medium-sized cards showing funded safety projects and community impact
**QR Code Visual**: Clean, prominent QR code display with surrounding explanatory graphics
**Partner Logos**: Clean, organized grid of sponsor and partner organization logos

## Key Design Principles
- **Trust-focused**: Professional, clean design that builds donor confidence
- **Impact-driven**: Prominent display of donation totals and project outcomes
- **Mobile-first**: Optimized for tap-to-give mobile interactions
- **Accessibility**: High contrast ratios, clear typography, intuitive navigation
- **Performance**: Optimized for GitHub Pages with minimal JavaScript dependencies