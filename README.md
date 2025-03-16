# Modern Testimonials System

A modern and responsive testimonials system that allows users to submit and view reviews with star ratings. Built with HTML, CSS, JavaScript, PHP, and MySQL.

## Features

- Modern and responsive design
- Interactive star rating system
- Smooth animations and transitions
- Secure form submission and data handling
- Real-time testimonials display
- Mobile-friendly interface

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)

## Setup Instructions

1. Configure your web server to serve the project files.

2. Create a MySQL database and update the database credentials in `dbase.php`:
   ```php
   $host = 'localhost';
   $dbname = 'testimonials';
   $username = 'your_username';
   $password = 'your_password';
   ```

3. The database and table will be created automatically when you first access the application.

4. Upload all files to your web server:
   - index.html
   - style.css
   - script.js
   - dbase.php
   - handle_testimonial.php

5. Access the application through your web browser.

## Security Considerations

- The system includes basic SQL injection protection through prepared statements
- XSS protection through input sanitization and output escaping
- CSRF protection can be added if needed
- Consider adding rate limiting for production use

## Customization

You can customize the appearance by modifying the CSS variables in `style.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #4f46e5;
    --background-color: #f8fafc;
    --text-color: #1e293b;
    --card-background: #ffffff;
    --border-radius: 12px;
}
```

## License

MIT License - Feel free to use and modify for your own projects. 
