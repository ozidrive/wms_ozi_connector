const DB_CONFIG = {
    DB_HOST: process.env.DB_HOST || 'ozi-db1.c306iyoqqj8p.ap-south-1.rds.amazonaws.com',
    DB_NAME: process.env.DB_NAME || 'shop_ozi_form_data',
    DB_PASSWORD: process.env.DB_PASSWORD || 'rLfcu9Y80S8X',
    DB_PORT: parseInt(process.env.DB_PORT || '3306'),
    DB_USER: process.env.DB_USER || 'admin'
  };
  const SERVER_CONFIG = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  const API_ENDPOINTS = {
    SUBMIT_FORM: '/submit-form'
  };
  export {
    DB_CONFIG,
    SERVER_CONFIG,
    API_ENDPOINTS
  };  