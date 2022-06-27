self.addEventListener("push", e => {
    const data = e.data.json();
    console.log(data)
    
    self.registration.showNotification(
        data.title, // title of the notification
        {
            body: "Alert", //the body of the push notification
            image: `${data.image}`,
            
        }
    );
});
// image