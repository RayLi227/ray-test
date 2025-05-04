// 使用CDN提供的全局变量，不使用import语句
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
    .insert(data);
  
  if (error) {
    console.log('Error inserting data:');
    console.error('Error inserting data:', error);
    console.error('Supabase error details:', error.message, error.details, error.hint);
  } else {
    console.log('Data inserted successfully.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const salesForm = document.getElementById('salesForm');
  const fileInput = document.getElementById('fileInput');

  // 处理表单提交，插入默认数据
  if (salesForm) {
    salesForm.addEventListener('submit', async (event) => {
      console.log("Starting form submission.");
      event.preventDefault();
      
      const defaultValues = {
        company_name: 'Default Company',
        season_name: 'Default Season',
        model_name: 'Default Model',
        production_quantity: 1000,
        sale_quantity: 900,
        price: 99.99
      };
      
      const newData = [defaultValues]; // 插入默认数据
      await insertProductionSalesData(newData);
    });
  }

  // 处理文件选择并上传数据
  if (fileInput) {
    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      
      if (file && file.type === 'application/json') {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
          try {
            const fileData = JSON.parse(e.target.result); // 解析JSON文件内容
            
            if (Array.isArray(fileData)) {
              console.log("上传的数据:", fileData);
              await insertProductionSalesData(fileData); // 插入数据
            } else {
              console.error('文件格式不正确，必须是包含数据的JSON数组。');
            }
          } catch (error) {
            console.error('解析JSON文件失败:', error);
          }
        };
        
        reader.readAsText(file); // 读取文件内容
      } else {
        console.error('请选择有效的JSON文件。');
      }
    });
  }
});
