// ==/UserScript==

(function() {
    'use strict';

    // Phần khởi tạo biến và mảng dữ liệu, sau khi đã deobfuscate.
    // Các biến và mảng ở đây đã được đổi tên cho dễ hiểu hơn.
     let stringArray = [
        // ... Mảng chuỗi, đã được giải mã một phần và tổ chức lại ...
        // Ví dụ:
        "yeumoney.com", "docs.google.com/forms/", "docs.google.com/spreadsheets/", "POST", "application/json",
         "text/html", //content type
        "https://api.ipify.org?format=json", //check ip
         "Không xác định",
         "Lỗi khi lấy IP:",
         "application/x-www-form-urlencoded",
         "onload",
         "onerror",

        //form
        "Bypasser Yeumoney", //title bypass form
         "Thiết bị bypass:", //device bypass title
        "Device Usage", //
        "Time bypass:",
         "ID.",
         "Code By An Đang Ngủ", //author
         "https://i.pinimg.com/736x/c3/6d/df/c366d409db2211510a6a1ae22d578c89.jpg",
        // ... (Phần còn lại của mảng, đã được deobfuscate)
        "Bypass Now",
        "Auto Bypass",
        "Auto Chuyển Trang",
        "https://discord.com/api/webhooks/1208115689669189733/example_webhook",//webhook url
        "GET",//method

        ".bypass-title", //class name
        "Nhập URL hoặc yêu cầu lấy link",//text
        "#bypass_input", //id bypass_input element
        ".btn-bypass",//class
        "#btn-bypass",//id btn
         "sub-container",
         "#autobypass", //id autobypass checkbox
        "autobypass",//name of autobypass check box
        "Auto Bypass",//title of autobypass checkbox
        '#autoclick',//auto click checkbox
         "autoclick", //name of autoclick checkbox
         "Auto Chuyển Trang", //text
        "bypass-container",
        "url-input",
        ".url-info > input[name=\"url-info\"]", //selector
        "display: none;", //style hide element

         ".bypass-title", //class name title
         "Yeumoney Bypasser To Google Sheets",

        ".bypass-panel",
         ".delay-slider-thumb",//class name
         ".delay-slider",
         "delay-value", //class
        "delay-slider-label",

         "style",
        //CSS

    ];


    async function getIp(){
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if(!response.ok){
                throw new Error('Lấy IP Lỗi')
            }
            const data = await response.json();
            return data.ip;

        } catch (error) {
            console.error("Lỗi khi lấy IP:", error);
            return "Không xác định";
        }
    }

    async function submitForm(code){
        let data = new FormData();
        data.append("username","example_user")
        data.append("avatar_url","example_avatar")
        data.append("embeds",JSON.stringify([{
            title:"Bypasser Yeumoney",
            color:0x99ff,
            fields:[
                {name:"Device Usage", value:`\`${navigator.userAgent}\``,inline:true},
                {name:"Time Bypass",value:`\`${new Date().toISOString()}\``,inline:true},
                {name:"ID.",value:`\`${code}\``,inline:false}
            ],
            footer:{
                text:"Code By An Đang Ngủ",
                icon_url:"https://i.pinimg.com/736x/c3/6d/df/c366d409db2211510a6a1ae22d578c89.jpg"
            },
            timestamp: new Date().toISOString()
        }]))

        fetch("https://discord.com/api/webhooks/1208115689669189733/example_webhook",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }).then(res => console.log("Gửi webhook thành công:", res))
    }
      async function mainFunction()
      {
        try{

              // Lấy thông tin người dùng từ Local Storage, nếu có
              let userData = JSON.parse(localStorage.getItem('user_data')) || {};

              // Lấy IP hiện tại
              const currentIP = await getIp();

              const combinedKey = currentIP + '-' + "yeumoney";  // Tạo key kết hợp

              const lastRunTimestamp = userData[combinedKey] || 0; // Thời điểm chạy cuối cùng
              userData[combinedKey] = lastRunTimestamp; // cập nhật

              localStorage.setItem('user_data', JSON.stringify(userData));
        }catch(e){
          console.error("Lỗi:",e.message)
        }
      }



    async function parseFromSheets(url) {
        try {
            const docId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];

            if (!docId) return null;

            const fetchUrl = `https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:json&tq&gid=0`; // URL để fetch
            const response = await fetch(fetchUrl);
            if (!response.ok) return null;

            // ... (Xử lý response)
            const text = await response.text();
            const json = JSON.parse(text.substr(47).slice(0, -2)); //cắt chuỗi magic

            const rows = json.table.rows
            const result = rows[0].c[2].v;


            return result;
        }
        catch(e){
            console.warn("Lỗi:",e.message);
            return null
        }
    }

    async function fetchCode(url)
    {
        try{
          let code = bypass_input.value //default code
          let formData = new URLSearchParams();
          formData.append("username", "example_user")
          formData.append("avatar_url", "exmaple_avt")
          formData.append("embeds",JSON.stringify([{
              title:"Bypasser",
              fields:[{
                  name:"**Thiết bị bypass**",value: `\`${navigator.userAgent}\``
              }]
          }]))

          let resp =  await  GM_xmlhttpRequest({
              method: 'POST',
              url: url,
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              data:formData,
              onload: function(response) {
                  console.log("on load called")
                  return response.responseText
              },
                onerror: function(error) {
                    console.log("Lỗi gọi API:",error)
                    return "error"
                }
            });
            return resp;
        }catch(e){
            console.warn("Error",e.message)
            return null
        }
    }

     async function runBypass(url_info){
         try{
           let shortLink = url_info.replace(/\/$/,''); // Xóa dấu / cuối nếu có
           const step1Result = await fetchCode(shortLink) // Gọi API lấy code
           const step2Result = await parseFromSheets(step1Result) //lấy data ở google sheet

            const step3Link = url_info.replace("yeumoney.com","ouo.io") //chuyển qua link ouo.io để call api lấy link

            const finalResult = await fetchCode(step3Link) // Gọi API lấy code
             return finalResult
         }
         catch(error){
            console.error("Lỗi:",error.message)
            return null
         }

      }


    function autoBypass() {
        try {
            // ... (Các phần code khác)
              // Lấy URL hiện tại
            const currentUrl = window.location.href;

            if(currentUrl.includes("yeumoney.com")){

                fetchCode().then(code => {
                  if(code) {
                    submitForm(code); //nếu có code
                  }

                }).catch(err => {
                  console.warn("Lỗi",err) //lỗi
                  submitForm("I_DONT_HAVE_CODE") //form trả về nếu có lỗi.
                })
            } else if(currentUrl.includes("docs.google.com/spreadsheets/")){ //check url
                runBypass().then(result => {
                  if(result) window.location.href = result //bypass và trả về link
                }).catch(err=>console.warn("Lỗi",err))
            } else if(currentUrl.includes("docs.google.com/forms/")){ //nếu là form
              //TODO
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }



    // ... (Các hàm khác, ví dụ: submitForm, autoBypass, v.v.)
    // Thêm CSS vào trang (các style cho giao diện của userscript)
    const styleElement = document.createElement('style');
    styleElement.textContent = `
     /* General styles */
.bypass-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    overflow: hidden;
}
.bypass-panel {
    position: relative;
    background: #f0f0f0;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 400px; /* Fixed width */
    max-width: 90%; /* Responsive width */
     display: grid;
    grid-template-columns: 1fr;
     gap: 16px;

}

.bypass-title{
    text-align:center;
    font-size:20px;
    margin:4px;
}

.sub-container{
 display:flex;
  align-items: center;
}

  input[type="checkbox"]{
      width:0;
      height:0;
      opacity:0;
      position:absolute;
      top:0;
      left:0;
  }


 input[type="radio"]{
      width:0;
      height:0;
      opacity:0;
      position:absolute;
      top:0;
      left:0;
  }

    `;
     document.head.appendChild(styleElement);


    // Tạo các phần tử HTML (nút bấm, ô nhập liệu, v.v.)
    const container = document.createElement('div');
    container.id = "bypass-container";

    // ... (Tạo các phần tử con và thêm vào container)

     const bypassTitle = document.createElement('h3');
    bypassTitle.className = "bypass-title";
    bypassTitle.textContent = "Bypasser Yeumoney To Google Sheets";

      container.appendChild(bypassTitle)


     const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'Nhập URL hoặc yêu cầu lấy link';
        urlInput.className = 'url-input';
        urlInput.id = 'bypass_input';
        container.appendChild(urlInput);

        const bypassButton = document.createElement('button');
        bypassButton.className = 'btn-bypass';
        bypassButton.textContent = 'Bypass Now';
        bypassButton.id = 'btn-bypass';

        //Gắn sự kiện click cho nút bypass
        bypassButton.onclick = async () => {
           const finalUrl = await runBypass(urlInput.value);
          if(finalUrl) window.location.href = finalUrl
        }


      const subContainer = document.createElement("div");
      subContainer.className = "sub-container";

      const autoBypassCheckbox = document.createElement('input');
      autoBypassCheckbox.type = 'checkbox';
      autoBypassCheckbox.id = 'autobypass';
      autoBypassCheckbox.checked = GM_getValue('autobypass', false);

      const autoBypassLabel = document.createElement('label');
      autoBypassLabel.htmlFor = 'autobypass';
      autoBypassLabel.textContent = 'Auto Bypass';
      subContainer.appendChild(autoBypassCheckbox)
      subContainer.appendChild(autoBypassLabel)

      container.appendChild(subContainer)

      const subContainer2 = document.createElement("div");
      subContainer2.className = "sub-container";
      const autoCLickCheckbox = document.createElement('input');
      autoCLickCheckbox.type = 'checkbox';
      autoCLickCheckbox.id = 'autoclick';
      autoCLickCheckbox.checked = GM_getValue('autoclick', false);

      const autoCLickLabel = document.createElement('label');
      autoCLickLabel.htmlFor = 'autoclick';
      autoCLickLabel.textContent = 'Auto Chuyển Trang';
      subContainer2.appendChild(autoCLickCheckbox)
      subContainer2.appendChild(autoCLickLabel)

        container.appendChild(subContainer2)


      //Thêm container và nút vào trang
    document.body.appendChild(container);

      autoBypassCheckbox.addEventListener('change', () => {
            GM_setValue('autobypass', autoBypassCheckbox.checked);
    });

    autoCLickCheckbox.addEventListener('change', () => {
            GM_setValue('autoclick', autoCLickCheckbox.checked);
    });

     if(autoBypassCheckbox.checked) autoBypass(); // Tự động bypass nếu đã được check

      window.onload = ()=>{

      const currentUrl = window.location.href;
        if (currentUrl.includes('docs.google.com/forms/')) {
          // ... (code xử lý Google Forms)
          fetchCode().then(code => {
            if(code) {
              submitForm(code);
            }

          }).catch(err => {
            console.warn("Lỗi",err)
            submitForm("I_DONT_HAVE_CODE")
          })

        } else if (currentUrl.includes('docs.google.com/spreadsheets/')) {
            runBypass().then(result=>{
              if(result) window.location.href = result;
            }).catch(err=>console.warn("Lỗi",err))

        } else if(currentUrl.includes("yeumoney.com")){
            autoBypass();
        }
    }

    // Gọi hàm chính khi script được load.
     mainFunction();
})();