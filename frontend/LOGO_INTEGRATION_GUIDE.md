# Logo Integration Guide for MySkills

## Step 1: Download Your Logo from Logo.com

1. Go to [logo.com](https://logo.com) and create your logo
2. Use "MySkills" as your company name
3. Choose Education/Training industry
4. Download in these formats:
   - **PNG with transparent background** (recommended for web)
   - **SVG** (scalable vector format, if available)
   - **Different sizes**: Small (for navigation), Medium (for login), Large (for headers)

## Step 2: Save Logo Files

Place your logo files in the `/public` folder:

```
frontend/
  public/
    logo.png          (main logo, ~200px height)
    logo-small.png    (navigation logo, ~40px height)
    logo-large.png    (header logo, ~100px height)
    vite.svg          (existing file)
```

## Step 3: Update Navigation Component

In `src/components/Navigation.jsx`, replace the placeholder:

**Find this section (around line 32):**

```jsx
{/* Placeholder for logo - replace with your logo */}
<div style={{
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    // ... placeholder styles
}}>
    MS
</div>
```

**Replace with:**

```jsx
<img 
    src="/logo-small.png" 
    alt="MySkills Logo" 
    style={{ height: '40px', marginRight: '10px' }}
/>
```

## Step 4: Update Login Page

In `src/pages/LoginPage.jsx`, replace the placeholder:

**Find this section (around line 8):**

```jsx
{/* Placeholder logo - replace with your logo */}
<div style={{
    width: '80px',
    height: '80px',
    backgroundColor: '#1E40AF',
    // ... placeholder styles
}}>
    MS
</div>
```

**Replace with:**

```jsx
<img 
    src="/logo.png" 
    alt="MySkills Logo" 
    style={{ height: '80px', marginBottom: '10px' }}
/>
```

## Step 5: Optional - Add Favicon

Replace the existing favicon:

1. Save a small version of your logo as `favicon.ico` (16x16 or 32x32 pixels)
2. Place it in the `/public` folder
3. It will automatically be used as the browser tab icon

## Logo Design Tips for Logo.com

### Color Schemes

- **Professional Blue**: #1E40AF (matches current theme)
- **Success Green**: #059669
- **Modern Purple**: #7C3AED
- **Gradient**: Blue to green or blue to purple

### Tagline Options

- "Empowering Skills, Enabling Success"
- "Master Your Skills, Shape Your Future"
- "Training Excellence, Digital Solutions"
- "Skills Development Made Simple"

### Style Suggestions

- Clean, modern font
- Include a subtle learning/growth icon
- Professional and trustworthy appearance
- Looks good in both light and dark themes

## Testing Your Logo

After updating the files:

1. Save all changes
2. Run `npm run dev` if not already running
3. Check the navigation bar and login page
4. Test that the logo is crisp and properly sized
5. Verify it works on different screen sizes

## File Structure After Integration

```
frontend/
  public/
    logo.png          ← Your main logo
    logo-small.png    ← Navigation logo
    favicon.ico       ← Browser tab icon
  src/
    components/
      Navigation.jsx  ← Updated with logo
    pages/
      LoginPage.jsx   ← Updated with logo
```

## Need Help?

If you encounter any issues:

1. Check that file paths are correct (`/logo.png` not `./logo.png`)
2. Verify file names match exactly
3. Make sure files are in the `/public` folder, not `/src/assets`
4. Check browser console for any loading errors

Ready to integrate your logo? Just follow these steps after downloading from logo.com!
