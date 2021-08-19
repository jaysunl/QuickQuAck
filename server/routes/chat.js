const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");

/*
Chat functionality CRUD Operations
Create Chatroom (POST)
Get Chatrooms (GET)
Create Message (POST)
Get Messages (GET)
Delete Message (DELETE)
Delete Chatroom (DELETE)
*/
router.post("/create-chatroom", authorization, (req,res) => {
    try{
        const {user_ids} = req.body;
        const author_id = req.user;
        console.log("Users:");
        console.log(user_ids);

        //Need to check if a chatroom already exists for the users in user_ids

        //If chatroom already exists, should lead the user to that chatroom...?



        pool.query(
            "INSERT INTO chatrooms (user_ids, chat_initiator) VALUES ($1, $2) RETURNING *;",
            [user_ids, author_id],
            (err, results) => {
            if (err) {
                throw err;
            }
            res.status(201).send(results.rows);
        }
        );

    }
    catch(err){
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/user-chatrooms", authorization, async (req, res) => {
    try{
        const user_id = req.user;
        // const userChatrooms = await pool.query(
        //     "SELECT * FROM (SELECT DISTINCT ON (chatrooms.chatroom_id) chatrooms.chatroom_id AS chatroom_id"
        // )
        

    } catch(err){
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

router.post("/create-message", authorization, (req, res) => {
   try{
       const { text } = req.body;
       const author_id = req.user;
       //const hardcoded_anon_name = 'Pink Flamingo';
       pool.query(
        "INSERT INTO test_messages (text, user_id) VALUES ($1, $2) RETURNING *;",
        [text, author_id],
        (err, results) => {
            if (err) {
                throw err;
            }
            res.status(201).send(results.rows);
        }
   );
   }
   catch (err){
       console.error(err.message);
       res.status(500).json("Server Error");
   }
   
   
});

router.get("/get-messages", authorization, (req, res) => {
    try{
        pool.query(
            "SELECT * FROM test_messages ORDER BY message_id DESC LIMIT 10",
            (err, results) => {
                if (err) {
                    throw err;
                }
                res.status(200).json(results.rows);
            }
        );
    }
    catch(err){
        console.err(err.message);
        restart.status(500).json("Server Error");
    }
   
});


module.exports = router;