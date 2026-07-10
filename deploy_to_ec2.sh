#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "================================================="
    echo "❌ 參數錯誤 (Error: Invalid arguments)"
    echo "使用方式 (Usage): $0 <EC2_IP> <使用者名稱> <PEM金鑰路徑>"
    echo "範例 (Example): ./deploy_to_ec2.sh 13.14.15.16 ubuntu ~/Desktop/my-key.pem"
    echo "================================================="
    exit 1
fi

IP=$1
USER=$2
PEM=$3

echo "🚀 [1/4] 開始打包編譯 React 應用程式 (npm run build)..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 打包失敗，請檢查錯誤訊息。"
    exit 1
fi

echo "🔒 [2/4] 設定 SSH 金鑰權限 (chmod 400)..."
chmod 400 "$PEM"

echo "📦 [3/4] 將編譯好的 dist 檔案上傳至 EC2..."
# 傳送到使用者的家目錄
scp -i "$PEM" -o StrictHostKeyChecking=no -r dist/ $USER@$IP:~/dist_tmp

if [ $? -ne 0 ]; then
    echo "❌ 檔案傳輸失敗，請檢查 IP、使用者名稱或金鑰是否正確。"
    exit 1
fi

echo "⚙️ [4/4] 遠端連線至 EC2 進行 Nginx 伺服器設定..."
ssh -i "$PEM" -o StrictHostKeyChecking=no $USER@$IP << 'EOF'
  # 判斷作業系統並安裝 Nginx
  if command -v apt-get > /dev/null; then
      echo ">> 偵測到 Ubuntu/Debian 系統，開始安裝 Nginx..."
      sudo apt-get update -y
      sudo apt-get install -y nginx
  elif command -v yum > /dev/null; then
      echo ">> 偵測到 Amazon Linux/CentOS 系統，開始安裝 Nginx..."
      sudo yum update -y
      sudo yum install -y nginx
  fi

  echo ">> 部署靜態檔案至 /var/www/html..."
  sudo mkdir -p /var/www/html
  sudo rm -rf /var/www/html/*
  sudo cp -r ~/dist_tmp/* /var/www/html/
  rm -rf ~/dist_tmp

  echo ">> 設定 Nginx SPA 路由規則 (支援 React Router)..."
  # 針對 Ubuntu
  if [ -d "/etc/nginx/sites-available" ]; then
    sudo bash -c 'cat > /etc/nginx/sites-available/default << "CONFIG"
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
CONFIG'
  fi

  # 針對 Amazon Linux
  if [ -d "/etc/nginx/conf.d" ]; then
    sudo bash -c 'cat > /etc/nginx/conf.d/spa.conf << "CONFIG"
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
CONFIG'
  fi

  echo ">> 重啟 Nginx 伺服器..."
  sudo systemctl restart nginx
  sudo systemctl enable nginx
EOF

echo "================================================="
echo "✅ 部署大功告成！ (Deployment Successful!)"
echo "🎉 你的戰情室儀表板已正式上線！"
echo "👉 請在瀏覽器開啟: http://$IP"
echo "================================================="
