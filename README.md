# TrendDrop – Fashion & Electronics Dropshipping Website

A professional dropshipping website for fashion and electronics, built with HTML, CSS, and JavaScript using Tailwind CSS.

## Pages

- **Home** (`index.html`) – Hero, featured categories, products, testimonials, newsletter
- **Shop** (`pages/shop.html`) – Full product catalog with filtering and sorting
- **About** (`pages/about.html`) – Brand story, team, and stats
- **Contact** (`pages/contact.html`) – Contact form and FAQ accordion

## Tech Stack

- HTML5 / CSS3 / JavaScript (ES6+)
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- Google Fonts – Inter

## Project Structure

```
dropShipping/
├── index.html
├── pages/
│   ├── shop.html
│   ├── about.html
│   └── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── shop.js
│   └── contact.js
├── assets/
│   └── images/
├── .gitignore
└── README.md
```

## Getting Started

Simply open `index.html` in your browser — no build step required.

For local development with live reload, you can use:

```bash
npx live-server
```

## Customization

- Update product data in `js/main.js` (`PRODUCTS` array)
- Change brand name and colors in each HTML file's Tailwind config block
- Replace emoji placeholders in `assets/images/` with real product images

## License

MIT
