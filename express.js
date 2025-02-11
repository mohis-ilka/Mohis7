import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';
import compression from 'compression'; // افزودن فشرده‌سازی

const app = express();
const port = 3000;

// اضافه کردن فشرده‌سازی
app.use(compression());

// بهینه‌سازی بیشتر تنظیمات transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '77test.team77@gmail.com',
        pass: 'xlry qugl smma hoep'
    },
    pool: true,
    maxConnections: 5, // تغییر تعداد اتصالات
    maxMessages: Infinity,
    rateDelta: 500, // کاهش فاصله زمانی
    rateLimit: 10, // افزایش تعداد ایمیل‌های مجاز
    secure: true,
    tls: {
        rejectUnauthorized: false
    }
});

// بهینه‌سازی middleware
app.use(cors({ 
    origin: '*',
    methods: ['POST'],
    credentials: true
}));

app.use(bodyParser.json({ 
    limit: '1mb',
    strict: true,
    type: 'application/json'
}));

// کش کردن اتصال
let cachedTransporter = null;

const getTransporter = async () => {
    if (cachedTransporter) return cachedTransporter;
    
    try {
        await transporter.verify();
        cachedTransporter = transporter;
        console.log('Mail server connection established and cached');
        return cachedTransporter;
    } catch (error) {
        console.error('Mail server connection error:', error);
        throw error;
    }
};

app.post('/send-email', async (req, res) => {
    try {
        const { name, contact, message } = req.body;
        
        const activeTransporter = await getTransporter();

        const mailOptions = {
            from: '77test.team77@gmail.com',
            to: '77test.team77@gmail.com',
            subject: 'پیام جدید',
            text: `نام: ${name}\nتماس: ${contact}\nپیام: ${message}`
        };

        const emailPromise = activeTransporter.sendMail(mailOptions);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email timeout')), 2000)
        );

        const info = await Promise.race([emailPromise, timeoutPromise]);
        res.status(200).json({ success: true, id: info.messageId });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: 'Send failed' });
    }
});

// پیش‌گرم کردن اتصال
getTransporter().catch(console.error);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));