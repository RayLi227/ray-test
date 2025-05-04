
// 使用CDN提供的全局变量，不使用import语句
// 检查全局范围内可用的Supabase对象
console.log("可用的Supabase对象:", window.supabase);

const supabaseUrl = 'https://szudwsrwiirzyiwdhsmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dWR3c3J3aWlyenlpd2Roc21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDg3MjEsImV4cCI6MjA2MTkyNDcyMX0.vLoaEmP9SsMm8q3z9od0ENzhmQq7JPEnwyX1wNN5wM8';

// 检查可用的Supabase全局对象名称
let supabase;
if (typeof createClient !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseKey);
} else if (window.supabase && typeof window.supabase.createClient === 'function') {
  supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
} else if (window.supabaseClient && typeof window.supabaseClient.createClient === 'function') {
  supabase = window.supabaseClient.createClient(supabaseUrl, supabaseKey);
} else {
  console.error("找不到Supabase客户端对象。请检查CDN是否正确加载。");
}

// Function to insert data into production_sales_data
async function insertProductionSalesData(data) {
  if (!supabase) {
    console.error("Supabase客户端未初始化，无法插入数据");
    return;
  }
  
  const { data: insertedData, error } = await supabase
    .from('production_sales_data')
    .insert([
      {
        company_name: data.company_name,
        season_name: data.season_name,
        model_name: data.model_name,
        production_quantity: data.production_quantity,
        sale_quantity: data.sale_quantity,
        price: data.price
      }
    ]);
  
  if (error) {
    console.log('Error inserting data:');
    console.error('Error inserting data:', error);
    console.error('Supabase error details:', error.message, error.details, error.hint);
  } else {
    console.log('Data inserted successfully.');
  }
}

const defaultValues = {
  company_name: 'Default Company',
  season_name: 'Default Season',
  model_name: 'Default Model',
  production_quantity: 1000,
  sale_quantity: 900,
  price: 99.99
};

document.addEventListener('DOMContentLoaded', () => {
  const salesForm = document.getElementById('salesForm');
  if (salesForm) {
    salesForm.addEventListener('submit', async (event) => {
      console.log("Starting form submission.")
      event.preventDefault();
      
      const company_name = defaultValues.company_name;
      const season_name = defaultValues.season_name;
      const model_name = defaultValues.model_name;
      const production_quantity = defaultValues.production_quantity;
      const sale_quantity = defaultValues.sale_quantity;
      const price = defaultValues.price;
      
      if (isNaN(production_quantity) || isNaN(sale_quantity) || isNaN(price)) {
        console.error('Invalid data format in form fields.');
        return;
      }
      
      const newData = { company_name, season_name, model_name, production_quantity, sale_quantity, price };
      
      // Insert the data
      console.log("Sending data to Supabase")
      await insertProductionSalesData(newData);
    });
  }
});