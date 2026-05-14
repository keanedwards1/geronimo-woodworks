# MarqueeKit - w/HTML & JavaScript

---

#### Note:

Instructions to properly view a `.md` file and to open a **live server**
can be found at the end of this document if needed.

## Viewing The Demo (2 minutes)

### If you already know how to open a live server for html/css/js:
1. Click on `index.html`
2. Open the live server.

### If you don't yet know:
##### Opening a Live Server

 We'll be using my favorite VS Code Extension of all time: **Live Server**. Here&apos;s how we do it:

1. Click the **Extensions** tab on the left side of VS Code
2. Search for **Live Server**
3. Click the **Install** button
4. Restart VS Code (shift + cmd + p → type: Developer: Reload Window)
5. Open the `index.html` file
6. Click **Go Live** (located in the lower right with a little radiowave icon)
7. This should open the demo in your prefered browser and the image marquees should be visible and working.

Feel free to look up other tutorials online for support with other IDE's like Sublime, Atom, Webstorm, and more.

This can be frustrating if you're new to this and you're IDE doesn't have a simple solution. If it's giving you troubles, you can skip this part or reach out to us for support and we'll help within 24 hours.

## Full Setup Instructions (5 minutes)

### 1. Copy these two files into your project:
- `marquee.js` goes into your scripts folder
- `marquee.css` goes into your styles folder

### 2. Copy the image folder into your project

Copy the `images` folder into your project’s **root** directory. This folder contains placeholder images at the moment. To make the marquee yours you can add your own images. 

*Example directory structure after adding the `images` folder*:
```
<!-- This is an example, you're file structure
will look unique, but should contain the newly
added files and folders -->

├── css
│   ├── shop.css
│   ├── checkout.css
│   ├── marquee.css
│   └── contact.css
├── html
│   ├── gallery.html
│   ├── shop.html
│   ├── checkout.html
│   ├── confirmation.html
│   ├── about.html
│   └── contact.html
├── images
│   ├── Speaker1.webp
│   ├── Speaker2.webp
│   ├── Speaker3.webp
│   ├── Speaker4.webp
│   └── logo.png
├── js
│   └── marquee.js
└── index.html

(Note: There's nothing requiring the images to be in the `images`
 folder except for the path in the html declaration. So you can
 move the images around as long as you adjust the path's to the
 images in the html.)

```
### 3. Add this html:
  1. Add this line into the `<head>` of your chosen `.html` file:
```html
<!-- make sure to adapt this path to your file structure -->
<link rel="stylesheet" href="/styles/marquee.css"> 
```


2. Add this `<section>` into the `<body>` of your chosen `.html` file
```html

        <div class="marquee-wrapper">
            <h1>MarqueeKit Examples</h1>  
            <section class="image-marquee">
                <h2>Basic Marquee</h2>
                <div id="image-marquee"></div>
            </section>
        </div>
```

3. Add these tags right before closing the `</body>` tag
```html

    <script src="/scripts/marquee.js"></script> <!-- adapt this too-->

    <script>
        new MarqueeKit("#image-marquee", { // this id needs to match the div's id
            images: [
                "/images/image1.webp", // Add your own images
                "/images/image2.webp",
                "/images/image3.webp",
                "/images/image4.webp"
            ],
            imageWidth: 250, // experiment with changing all of these and have fun 🕺
            height: 200,  
            speed: 50,
            gap: 20,
            reverse: false,
            pauseOnHover: false,
            imageScale: 1, // try 1.05
            borderRadius: 8,
        });
    </script>

</body>
```

I know that I sound like a broken record, but for the love of all that is sacred, make sure that all the paths are correct.

### 4. Start a Live Server (see instructions above if needed)

### 5. Remove body styling from `marquee.css` if interfering with your sites existing styles

```html
/* REMOVE FROM HERE */
body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    padding: 20px 0px;
    background-color: #ffffff;
    background-image: 
        linear-gradient(rgba(3, 3, 3, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(8, 8, 8, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    min-height: 100vh;
}
/* TO HERE */

<!-- rest of the css rules -->

@media (prefers-color-scheme: dark) {


    /* AND FROM HERE */
    body {
        background-color: #0a0a0a;
        background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 40px 40px;
        color: #e1e1e1;
    }
    /* TO HERE */


    <!-- rest of the css rules -->

}
```


That's it! Your marquee should be working now.
**Don't hesitage to email us at marqueekit1@gmail.com for support if anythings not working.**

## Customization Options

Now the fun bit. You can make your marquee unique by adding any of these options:
```javascript
new MarqueeKit("#my-marquee", {
    images: [ // use at least 2 images
        "/images/image1.jpg", 
        "/images/image2.jpg",
        "/images/image3.jpg"
        ],
    // Optional
    imageWidth: 250          // set's the width of each image in pixels
    height: 200,            // set's the marquee's height in pixels
    speed: 50,             // set's scroll speed (higher = faster)
    gap: 20,              // creates space between each image (in pixels)
    reverse: false,      // reverses the direction of the marquee (true = scroll right)
    pauseOnHover: true  // add a smooth pause on hover effect (true = active)
    imageScale: 1.05   // makes each image grow on hover. you can experiment with 1.08, 1.1, 1.5, 2, etc.,
    borderRadius: 10  // adjust how rounded the corners of each image are.
});

/* To add an on-load animation add this to your head */
<link rel="stylesheet" href="/css/animate.css">
/* Make sure to add it below the marquee.css import */
```

## PRO Customization

### Adding A Fade Effect

This is a fancy little bit, and it's super easy to add. To integrate:

1. Go to `/css/fade.css`
2. Copy the css, and paste it at the end of your existing file

(Note: `fade.css` contains classes already defined in `marquee.css` so for a production project, it's important to make sure that that the classes are integrated in a sensible order, and that in duplicated classes are merged (This isn't critical for functionality though).)

### Adding On-Load Animations

This change is very similar to the implementation of the fade effect. Here's the change:

1. Go to `/css/animate.css`
2. Copy the css, and paste it at the end of your existing css
   
As long as you haven't changed the class names defined in the html definition, it should be up and running immediately, you can reload the window to test :0

### Adding Mixed Image Sizes

1. Copy the styles `.marquee-image` defined in `mixed-image-size.css` into .marquee-image that already exists in `marquee.css`.
2. In the construction, change `width` to `auto` as show below:

```html
        new MarqueeKit("#mixed-size-marquee", {
            images: images1,
            height: 300,
            imageWidth: 'auto',  // critical change
            speed: 50,
            gap: 20,
            reverse: false,
            imageScale: 1,
            pauseOnHover: false,
            borderRadius: 8
        });
```


## Previewing `.md` files
If you&apos;ve never viewed a `.md` before, you can do that with
the extensions: **Markdown Preview Github Styling** or 
**Markdown Preview Enhanced** in the VS Code ecosystem.
You can also view it through the command palette:

1. Open the `.md` file
2. Press `shift + ctrl/cmd + p`
3. Search: **Markdown: Open Preview**
4. Press Enter

## Need More Help?

**Check out `index.html` for a working example, or email us at marqueekit1@gmail.com**