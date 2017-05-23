# backend-of-blogger-social-site

## 專案說明
為[Blog Social Site](https://github.com/alvinyen/blogger-social-site)的後端API，應用新版的node、Express搭配ES6+ async await等 語法撰寫完成，在資料庫的部分使用mLab的mongodb服務，並透過mongoose來完成操作。另外，也應用JWT及bcrypt等 工具來確保資安。使用Nginx搭配pm2部署於Digital Ocean。

## API SPEC.
- host：http://api.alvinyen.me:3000
- /auth/login
    - 登入
    - Request Method: POST
    - Content-Type：application/json
    - Request Data in Body:
        - username：帳號
        - password：密碼
    - Error Handling：
        - { error: '錯誤訊息' }
        - 例如
            - { error: '用戶不存在' }
            - { error: '密碼無效' }
    - Response
        - Content-Type：application/json
        - Body: 
            ```
            {
                token: 應用JWT簽署的token,
                user: {
                    name: 用戶帳號,
                    admin: 是否為管理員 (boolean)
                }
            }
            ```
- /auth/signup
    - 註冊
    - Request Method: POST
    - Content-Type：application/json
    - Request Data in Body:
        - username：帳號
        - password：密碼
    - Error Handling：
        - { error: '錯誤訊息' }
        - 例如
            - { error: 'User already exist!' }
    - Response
        - Content-Type：application/json
        - Body: 
            ```
            {
                token: 應用JWT簽署的token,
                user: {
                    name: 用戶帳號
                }
            }
            ```
- /posts
    - 新增文章
    - Request Method: POST
    - Content-Type：application/json
    - Request Data in Body:
        - name：文章名稱
        - content：文章內容
    - Response
        - Content-Type：application/json
        - Body: 
            ```
            {
                message: 新增文章結果,
                post: {
                    name: 文章名稱,
                    content: 文章內容
                }
            }
            ```
- /posts
    - 獲取所有文章
    - Request Method: GET
    - Response
        - Content-Type：application/json
        - Body: 
            ```
            {
                message: 新增文章結果,
                posts: [
                    { 
                        _id: document id,
                        name: 文章標題,
                        content： 文章內容
                    },
                    ...
                ]
            }
            ```
- /posts/:post_id
    - 針對單篇文章修改標題或內容
    - Request Method: PUT
    - Content-Type：application/json
    - Request Parameters:
        - post_id: 文章id (document id)
    - Request Data in Body:
        - name：文章名稱
        - content：文章內容
    - Error Handling：
        - { error: '錯誤訊息' }
    - Response
        - Content-Type：application/json
        - Body: 
            ```
            {
                message: 更新文章結果,
                post: {
                    _id: document id,
                    name: 文章標題,
                    content： 文章內容
                }
            }
            ```
- /posts/:post_id
    - 針對單篇文章修改標題或內容
    - Request Method: DELETE
    - Request Parameters:
        - post_id: 文章id (document id)
    - Error Handling：
        - { error: '錯誤訊息' }
    - Response
        - Content-Type：application/json
        - Body: 
            ```
            {
                message: 更新文章結果,
                _id: 刪除的文章的id (document id)
            }
            ```

 
