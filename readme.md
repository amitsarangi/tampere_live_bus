# Living Lab Bus Development Kit

![LLB Logo](https://llb.sis.uta.fi/portal/img/llb_bg2.png)

The development kit is used to create applications tht can be deployed to the [Living Lab Bus Platform ](https://llb.sis.uta.fi/) through the [LLB Developer Portal](https://llb.sis.uta.fi/portal).

- ### Guidelines

    -[Developer Guidelines](https://utafi-my.sharepoint.com/personal/as422619_staff_uta_fi/_layouts/15/guestaccess.aspx?guestaccesstoken=ObsxF57XkyWxfc0ICkf5uWO8gPF9SKun8%2bGeRmCMsxM%3d&docid=039f6b241e8b44a5f94447507502a8af0&rev=1)

    -[Design Guidelines](https://utafi-my.sharepoint.com/personal/as422619_staff_uta_fi/_layouts/15/guestaccess.aspx?guestaccesstoken=QGwx73%2fO6P%2fKjnI2rHFNyyzwwT2jVjowxfYp%2fEQ4YVo%3d&docid=0cbb622a9f21c47d7b683c28b4338e3a1&rev=1)

- ### Installation

  - Install [NodeJS](https://nodejs.org/en/)

  - Clone the repo locally
   ```
    git clone https://github.com/llb-uta/development-kit.git
    ```
  - Or [Download ZIP](https://github.com/llb-uta/development-kit/archive/master.zip) and extract to your directory of choice.
  
  - Open command prompt, navigate to the directory
  - Install dependency modules
   ```
    npm install
    ```
  - Launch the development kit
    ```
    npm start
    ```

- ### Note

  - *Your application resides under the /app directory.*
  - *Do not modify the root level directories. They are related to the development kit , but not your application.*
  - *You must have a index.html file*
  - *Once you are satisfied with the application, you can zip the app directory and upload it to the developer portal*
