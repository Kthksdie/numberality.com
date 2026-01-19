# Numberality

An interactive web application for exploring the hidden patterns in numbers through visual mathematics and sequence analysis.

## Overview

Numberality is a sophisticated mathematical visualization tool that allows users to explore integer properties, mathematical sequences, and number theory concepts through an intuitive visual interface. The application combines advanced mathematical algorithms with modern web technologies to create an engaging experience for mathematics enthusiasts, educators, and researchers.

## Features

### Core Functionality
- **Arbitrary Precision Integer Support**: Handle numbers of any size with BigInt implementation
- **Prime Number Detection**: Uses Euler test (base 3) for efficient primality checking
- **Divisor Visualization**: Display factors of numbers in clear, visual formats
- **Interactive Calculator**: Built-in calculator with advanced mathematical operations
- **Sequence Generation**: Explore famous mathematical sequences like Fibonacci, Pell, and Collatz

### Visual Representations
- **Multiple Display Styles**: Choose between digits, circles, or squares visualization
- **Dynamic Sizing**: Adjustable block radius and visual scale
- **Color-coded Elements**: Different colors for primes, composites, and special numbers
- **Canvas-based Rendering**: Smooth, responsive graphics using HTML5 Canvas

### Mathematical Sequences
- **Fibonacci Sequence** (A000045): Classic recursive sequence
- **Pell Numbers** (A000129): Related to square triangular numbers
- **Collatz Conjecture**: Explore the famous 3n+1 problem
- **Custom Sequences**: Support for OEIS sequences and user-defined lists
- **Sequence Playback**: Step through sequences with play/pause controls

### Interactive Controls
- **Keyboard Navigation**: Use WASD keys for navigation and number input
- **Mouse Interaction**: Drag to adjust values and levels
- **Real-time Updates**: Instant visual feedback for all operations
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- No additional software installation required

### Running the Application
1. Clone or download the repository
2. Open `src/index.html` in your web browser
3. The application will load automatically

### Basic Usage
1. **Enter a Number**: Type any integer in the input field
2. **Explore Factors**: View the visual representation of the number's divisors
3. **Try Sequences**: Select a sequence from the dropdown and use play/next buttons
4. **Adjust Display**: Change style, size, and level settings in the controls

## Controls

### Keyboard Shortcuts
- **Number Keys (0-9)**: Direct number input
- **Enter**: Calculate result
- **Delete**: Clear/reset
- **Backspace**: Undo last character
- **W/S**: Decrease/increase level
- **A/D**: Decrease/increase number
- **Mouse Scroll**: Adjust number value
- **Mouse Drag**: Interactive navigation

### Calculator Operations
- **Basic Operations**: Addition (+), Subtraction (-), Multiplication (×), Division (÷)
- **Advanced Functions**: Square root (√), Power (^), Sign change (±)
- **Clear Functions**: Clear (C) and reset operations

## Mathematical Features

### Prime Detection
The application uses the Euler test with base 3 for efficient primality checking:
- Handles arbitrary precision integers
- No practical limits on number size
- Fast probabilistic primality testing

### Divisor Analysis
- Complete factor visualization
- Sorted divisor display
- Efficient factorization algorithms
- Support for negative numbers

### Sequence Analysis
- **Fibonacci**: F(n) = F(n-1) + F(n-2)
- **Pell**: P(n) = 2P(n-1) + P(n-2)
- **Collatz**: 3n+1 conjecture exploration
- **Custom OEIS**: Integration with Online Encyclopedia of Integer Sequences

## Technical Details

### Architecture
- **Frontend**: Pure HTML5, CSS3, and JavaScript
- **Graphics**: HTML5 Canvas for rendering
- **Mathematics**: Custom BigInt implementations
- **UI Framework**: Bootstrap for responsive design

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Requires ES2020 BigInt support

### Performance Considerations
- Optimized for large number calculations
- Efficient rendering algorithms
- Memory-conscious design
- Responsive to user input

## Project Structure

```
numberality.com.v3/
├── src/
│   ├── index.html          # Main application file
│   ├── css/
│   │   ├── main.css        # Core styles
│   │   ├── calculator.css  # Calculator interface styles
│   │   └── input.css       # Input control styles
│   ├── js/
│   │   ├── index.js        # Main application logic
│   │   ├── maths.js        # Mathematical functions
│   │   ├── calculator.js   # Calculator functionality
│   │   ├── sequences.js    # Sequence definitions
│   │   ├── sequencer.js    # Sequence playback logic
│   │   ├── scanner.js      # Number scanning features
│   │   ├── colors.js       # Color management
│   │   ├── mouse.js        # Mouse interaction handling
│   │   └── random.js       # Random number generation
│   ├── images/             # Application images and icons
│   └── libs/               # External libraries (Bootstrap)
└── readme.md              # This file
```

## Development

### Local Development
1. Clone the repository
2. Open `src/index.html` in a local web server
3. Make changes to JavaScript, CSS, or HTML files
4. Refresh browser to see updates

### Contributing
- Fork the repository
- Create a feature branch
- Make your changes
- Test thoroughly with various number inputs
- Submit a pull request

## Browser Notes

### Performance Warnings
- Very large numbers may cause browser performance issues
- The application has no built-in limits - use responsibly
- Consider browser memory limitations when working with extremely large numbers

### Known Limitations
- Some browsers may have different BigInt performance characteristics
- Mobile browsers may have reduced performance with large calculations
- Canvas rendering performance varies by device capabilities

## License

This project is open source. Please check the repository for specific licensing information.

## Contact

- **Developer**: @JKthksdie
- **Website**: https://www.numberality.com/
- **Twitter**: [@JKthksdie](https://twitter.com/JKthksdie)

## Acknowledgments

- Online Encyclopedia of Integer Sequences (OEIS) for sequence references
- Bootstrap framework for responsive design
- Mathematical community for sequence definitions and algorithms

---

*Numberality - Discover the hidden patterns in numbers through interactive visualization.*