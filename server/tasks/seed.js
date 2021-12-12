const dbConnection = require('../config/mongoConnection');
const {users} = require('../data');
const {reviews} = require('../data');
const {products} = require('../data');
const {community} = require('../data');

const main = async()=>{
    const db = await dbConnection.connecttoDB();
    await db.dropDatabase();
    try{

        //common password for all the users
        const password = "password";

        //creating develoeprs

        const dev1 = await users.createUser("Levi Szabo","levi@xyz.com",password);
        const dev2 = await users.createUser("Bjoggi Gudmundsson","bjoggi@xyz.com",password);
        const dev3 = await users.createUser("Aaron Vontell","aaron@xyz.com",password);
        const dev4 = await users.createUser("Laura Holmes","laura@xyz.com",password);
        const dev5 = await users.createUser("Reaal Khalil","reaal@xyz.com",password);
        const dev6 = await users.createUser("Glenn Cochon","glenn@xyz.com",password);
        const dev7 = await users.createUser("Priyanshu Nayan","priyanshu@xyz.com",password);
        const dev8 = await users.createUser("Kshitij Singh","kshitij@xyz.com",password);
        const dev9 = await users.createUser("Richard White","richard@xyz.com",password);
        const dev10 = await users.createUser("Adrian Pascu","adrian@xyz.com",password);
        const dev11 = await users.createUser("Patrick Brouwer","patrick@xyz.com",password);
        const dev12 = await users.createUser("Parth Shah","parth@xyz.com",password);
        const dev13 = await users.createUser("Pascal Burkle","pascal@xyz.com",password);
        const dev14 = await users.createUser("Duncan Hall","duncan@xyz.com",password);
        const dev15 = await users.createUser("Mike Simpson","mike@xyz.com",password);
        const dev16 = await users.createUser("Mikael Cho","mikael@xyz.com",password);
        
        //creating users

        const user1 = await users.createUser("Sophia","sophia@xyz.com",password);
        const user2 = await users.createUser("Andrea","andrea@xyz.com",password);
        const user3 = await users.createUser("Victoria","victoria@xyz.com",password);
        const user4 = await users.createUser("Joseph","joseph@xyz.com",password);
        const user5 = await users.createUser("Olivia","olivia@xyz.com",password);
        const user6 = await users.createUser("Erik","erik@xyz.com", password);
        const user7 = await users.createUser("Emma","emma@xyz.com",password);
        const user8 = await users.createUser("Lucas","lucas@xyz.com",password);
        //users uploading profile picture using update dbfunction
        
        await users.updateUser({password: password,photo : "sophia.jpeg",name : "Sophia",email: "sophia@xyz.com"});
        await users.updateUser({password:password, photo:"andrea.jpeg",name:"Andrea",email:"andrea@xyz.com"});
        await users.updateUser({password: password, photo: "victoria.jpeg",name : "Victoria", email: "victoria@xyz.com"});
        await users.updateUser({password: password, photo: "joseph.jpeg", name : "Joseph", email: "joseph@xyz.com"});
        await users.updateUser({password: password, photo: "olivia.jpeg", name : "Olivia", email: "olivia@xyz.com"});
        await users.updateUser({password: password, photo: "erik.jpeg", name : "Erik", email: "erik@xyz.com"});
        await users.updateUser({password: password, photo: "emma.jpeg", name : "Emma", email: "emma@xyz.com"});
        await users.updateUser({password: password, photo: "lucas.jpeg", name : "Lucas", email: "lucas@xyz.com"});
        //creating products

        const prod1 = await products.addProduct(
        "NeuralCam 5",
        "NeuralCam 5 is the most advanced Computational Photography Camera App for the iPhone for both Night and Day photos. Capture better photos with AI powered 48MP Super-resolution, Macro-Mode and NeuralHDR.",
        "https://neural.cam",
        "neuralCam.png",       
        ["Photography","IPhone","Artificial Intelligence"],
        "Levi Szabo",
        dev1.user._id.toString()
        );

       // {"_id":{"$oid":"61b462c2ea8741b8257eb915"},"productName":"NeuralCam 5","description":"NeuralCam 5 is the most advanced Computational Photography Camera App for the iPhone for both Night and Day photos. Capture better photos with AI powered 48MP Super-resolution, Macro-Mode and NeuralHDR.","websiteUrl":"https://neural.cam","logo":"neuralCam.png","tags":["Photography","IPhone","Artificial Intelligence"],"developer":"Levi Szabo","reviews":[],"rating":"5.00","likes":0,"devId":"61b462c2ea8741b8257eb914"}

        const prod2 = await products.addProduct(
            "Break",
            "See when your friends are available and signal when you need a break - to live your social life in full. Send a signal to a group of people you choose and have a spontaneous audio chat, grab a cup of coffee together or meet for lunch to catch up.",
            "https://www.break.is",
            "break.jpeg",       
            ["Free","Social Media Tools"],
            "Bjoggi Gudmundsson",
            dev2.user._id.toString()
        );

        const prod3 = await products.addProduct(
            "PogChat",
            "PogChat is a Twitch extension that provides a place to talk about streamers, games, esports, and more in a fun way. Login with Twitch, see popular topics, and engage with the community!",
            "https://www.pogchat.gg",
            "PogChat.png",       
            ["Chrome Extension","Messaging","Social Media Tools","Games"],
            "Aaron Vontell",
            dev3.user._id.toString()
        );

        const prod4 = await products.addProduct(
            "Grasshopper",
            "Grasshopper is the coding app for beginners. With fun, quick lessons on your phone, the app teaches adult learners to write real JavaScript. It’s currently available for free on Android and iOS. Grasshopper is built by a team within Area 120, a workshop for experimental projects.",
            "https://grasshopper.app",
            "Grasshopper.png",       
            ["Puzzle Games","Free","Education"],
            "Laura Holmes",
            dev4.user._id.toString()
        );


        const prod5 = await products.addProduct(
            "JSRobot",
            "Control a robot to collect coins and reach the end of a level by learning to code in JavaScript",
            "https://lab.reaal.me",
            "JSRobot.jpeg",       
            ["Free","Education","Games"],
            "Reaal Khalil",
            dev5.user._id.toString()
        );


        const prod6 = await products.addProduct(
            "AutoDraw",
            "Autocorrect for drawing, by Google",
            "https://www.autodraw.com",
            "AutoDraw.png",       
            ["Art","Artificial Intelligence"],
            "Glenn Cochon",
            dev6.user._id.toString()
        );

        const prod7 = await products.addProduct(
            "What's Next",
            "What's Next is a Chrome Extension that replaces your new tab with your upcoming events. You can join those virtual meetings with just a click without needing to open the calendar every time.",
            "https://chrome.google.com",
            "WhatsNext.jpeg",       
            ["Chrome Extension","Free"],
            "Priyanshu Nayan",
            dev7.user._id.toString()
        );

        const prod8 = await products.addProduct(
            "SuperDMs",
            "SuperDMs helps you grow your following by sending bulk DMs to your tweet responders",
            "https://www.superdms.app",
            "SuperDMs.jpeg",       
            ["Productivity","Free","Marketing"],
            "Kshitij Singh",
            dev8.user._id.toString()
        );
        const prod9 = await products.addProduct(
            "Fathom",
            "Fathom records, transcribes, and replaces note taking with a click of a button on your Zoom calls, so you can simply focus on the conversation at hand.",
            "https://fathom.video",
            "Fathom.png",       
            ["Productivity","Free","Artificial Intelligence"],
            "Richard White",
            dev9.user._id.toString()
        );
        const prod10 = await products.addProduct(
            "Bookstash",
            "Bookstash is a free library of curated summaries from top nonfiction books. We pick a book for you and give you all the key ideas and you get to save your favorites for later & track your reading progress.",
            "https://bookstash.io",
            "Bookstash.png",       
            ["Productivity","Free","Books"],
            "Adrian Pascu",
            dev10.user._id.toString()
        );
        const prod11 = await products.addProduct(
            "Spirit",
            "Spirit Studio is an animation tool that helps designers and developers creating and managing their animations real time in the browser.",
            "https://spiritapp.io",
            "Spirit.jpeg",       
            ["Productivity","Design Tools","Developer Tools"],
            "Patrick Brouwer",
            dev11.user._id.toString()
        );


        const prod12 = await products.addProduct(
            "Zero Balance",
            "Use Zerobalance virtual cards for all your Free-Trial Signups and never worry about getting charged or cancellations. Explore our library of 100+ free trials across different categories and enjoy all the benefits without a worry.",
            "https://www.zerobalance.club",
            "ZeroBalance.jpeg",       
            ["Productivity","Free"],
            "Parth Shah",
            dev12.user._id.toString()
        );


        const prod13 = await products.addProduct(
            "Image Extractor",
            "Extract.pics is an easy to use tool that allows you to extract, view and download images from any public website. Simply paste the URL of the website into the input field and click 'Extract' to start the process.completely free to use!",
            "https://extract.pics",
            "ImageExtractor.png",       
            ["Productivity","Free","Marketing","Developer Tools"],
            "Pascal Burkle",
            dev13.user._id.toString()
        );


        const prod14 = await products.addProduct(
            "Remotely",
            "SuperDMs helps you grow your following by sending bulk DMs to your tweet responders",
            "https://www.superdms.app",
            "Remotely.png",       
            ["Productivity","Free"],
            "Duncan Hall",
            dev14.user._id.toString()
        );


        const prod15 = await products.addProduct(
            "Marble",
            "Build the ultimate content experience for your audience and your sponsors by putting all your content in one place to increase engagement and level up your ad revenue. Combine your Instagram, TikTok, Youtube, Spotify, Facebook, Twitter and your external links.",
            "https://get.marble.app",
            "Marble.png",       
            ["Social Media Tools","Free","Marketing"],
            "Mike Simpson",
            dev15.user._id.toString()
        );

        const prod16 = await products.addProduct(
            "Unsplash 5.0",
            "Unsplash 5.0 is a massive online catalog of the best online wallpapers from top photographers and editors around the world, free for you to use for anything.",
            "https://unsplash.com",
            "Unsplash.jpeg",       
            ["Free","Design Tools","Photography"],
            "Mikael Cho",
            dev16.user._id.toString()
        );

        



        //Users adding Reviews for Product1
        
        const prod1_review1 = await reviews.AddReview(prod1._id,"Awesome, very useful","5.0");
        await reviews.AddReviewToUser(user1.user._id,prod1_review1._id);
        
        const prod1_review2 = await reviews.AddReview(prod1._id,"Great, I like it so far", "4.8");
        await reviews.AddReviewToUser(user2.user._id,prod1_review2._id);


        //Users adding Reviews for Product2
        const prod2_review1 = await reviews.AddReview(prod2._id,"I like it","5.0");
        await reviews.AddReviewToUser(user2.user._id,prod2_review1._id);
        
        const prod2_review2 = await reviews.AddReview(prod2._id,"Mind Blowing", "5.0");
        await reviews.AddReviewToUser(user3.user._id,prod2_review2._id);


         //Users adding Reviews for Product3

         const prod3_review1 = await reviews.AddReview(prod3._id,"So good","5.0");
         await reviews.AddReviewToUser(user7.user._id,prod3_review1._id);
         
         const prod3_review2 = await reviews.AddReview(prod3._id,"Nice", "4.7");
         await reviews.AddReviewToUser(user8.user._id,prod3_review2._id);

        //Users adding Reviews for Product4

         const prod4_review1 = await reviews.AddReview(prod4._id,"Can't be better than this","5.0");
         await reviews.AddReviewToUser(user4.user._id,prod4_review1._id);
         
         const prod4_review2 = await reviews.AddReview(prod4._id,"Great", "5.0");
         await reviews.AddReviewToUser(user5.user._id,prod4_review2._id);


         //Users adding Reviews for Product5

         const prod5_review1 = await reviews.AddReview(prod5._id,"Positive Review","5.0");
         await reviews.AddReviewToUser(user8.user._id,prod5_review1._id);
         
         const prod5_review2 = await reviews.AddReview(prod5._id,"Good", "3.0");
         await reviews.AddReviewToUser(user6.user._id,prod5_review2._id);
        

         //Users adding Reviews for Product10

         const prod10_review1 = await reviews.AddReview(prod10._id,"Positive Review","5.0");
         await reviews.AddReviewToUser(user3.user._id,prod5_review1._id);
         
         const prod10_review2 = await reviews.AddReview(prod10._id,"Good", "3.0");
         await reviews.AddReviewToUser(user5.user._id,prod10_review2._id);


        
        //Users adding likes for Product1
        
        
        await users.updateLikedProducts(user1.user._id.toString());
        await products.updateCount(prod1._id.toString(),true);

        await users.updateLikedProducts(user2.user._id.toString());
        await products.updateCount(prod1._id.toString(),true);

        await users.updateLikedProducts(user3.user._id.toString());
        await products.updateCount(prod1._id.toString(),true);
        

        //Users adding likes for Product2
        await users.updateLikedProducts(user2.user._id.toString());
        await products.updateCount(prod2._id.toString(),true);

        await users.updateLikedProducts(user3.user._id.toString());
        await products.updateCount(prod2._id.toString(),true);

        await users.updateLikedProducts(user4.user._id.toString());
        await products.updateCount(prod2._id.toString(),true);

        await users.updateLikedProducts(user5.user._id.toString());
        await products.updateCount(prod2._id.toString(),true);

        await users.updateLikedProducts(user6.user._id.toString());
        await products.updateCount(prod2._id.toString(),true);
        
        await users.updateLikedProducts(user7.user._id.toString());
        await products.updateCount(prod2._id.toString(),true);
        
        
        //Users adding likes for Product10

        await users.updateLikedProducts(user2.user._id.toString());
        await products.updateCount(prod10._id.toString(),true);

        await users.updateLikedProducts(user3.user._id.toString());
        await products.updateCount(prod10._id.toString(),true);

        await users.updateLikedProducts(user4.user._id.toString());
        await products.updateCount(prod10._id.toString(),true);

        await users.updateLikedProducts(user5.user._id.toString());
        await products.updateCount(prod10._id.toString(),true);

        await users.updateLikedProducts(user6.user._id.toString());
        await products.updateCount(prod10._id.toString(),true);

        //Users adding likes for Product16


        await users.updateLikedProducts(user2.user._id.toString());
        await products.updateCount(prod16._id.toString(),true);

        await users.updateLikedProducts(user3.user._id.toString());
        await products.updateCount(prod16._id.toString(),true);

        await users.updateLikedProducts(user4.user._id.toString());
        await products.updateCount(prod16._id.toString(),true);

        await users.updateLikedProducts(user5.user._id.toString());
        await products.updateCount(prod16._id.toString(),true);

        //Users adding likes for Product12

        await users.updateLikedProducts(user6.user._id.toString());
        await products.updateCount(prod12._id.toString(),true);

        await users.updateLikedProducts(user7.user._id.toString());
        await products.updateCount(prod12._id.toString(),true);

        await users.updateLikedProducts(user8.user._id.toString());
        await products.updateCount(prod12._id.toString(),true);

        
        //Users adding likes for Product3

        
        await users.updateLikedProducts(user1.user._id.toString());
        await products.updateCount(prod3._id.toString(),true);


        await users.updateLikedProducts(user2.user._id.toString());
        await products.updateCount(prod3._id.toString(),true);

        await users.updateLikedProducts(user3.user._id.toString());
        await products.updateCount(prod3._id.toString(),true);

        await users.updateLikedProducts(user4.user._id.toString());
        await products.updateCount(prod3._id.toString(),true);

        await users.updateLikedProducts(user5.user._id.toString());
        await products.updateCount(prod3._id.toString(),true);

         await users.updateLikedProducts(user6.user._id.toString());
         await products.updateCount(prod3._id.toString(),true);
 
         await users.updateLikedProducts(user7.user._id.toString());
         await products.updateCount(prod3._id.toString(),true);
 
         await users.updateLikedProducts(user8.user._id.toString());
         await products.updateCount(prod3._id.toString(),true);
        
         //Users adding likes for Product 4

         await users.updateLikedProducts(user1.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
        
         await users.updateLikedProducts(user2.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
            
         await users.updateLikedProducts(user3.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
            
         await users.updateLikedProducts(user4.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
            
         await users.updateLikedProducts(user5.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
            
         await users.updateLikedProducts(user6.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
            
         await users.updateLikedProducts(user7.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
            
         await users.updateLikedProducts(user8.user._id.toString());
         await products.updateCount(prod4._id.toString(),true);
            



    }catch(e){
        console.log('Error : ', e);
    }
    await dbConnection.closeConnection();
};

main().catch((e) => {
    console.log(e);
  });
  

