const express = require("express"); //import Express
const router = express(); //create an Express application on the app variable
const authorization = require("../middleware/authorization");
const pool = require("../db");

//

/*
Post functionality CRUD Operations
Create Post(POST)
Retrieve main feed(GET)
Retrieve Home (filtered) feed (GET)
Create Comment (POST)
Delete Post (DELETE)
Update Post(PUT)
Update Comment(PUT)
Upvote/Downvote a post (POST)
*/

router.post("/create-post", authorization, async (req, res) => {
  try {
    //Reading information contained in post
    const { postText, postTag } = req.body;
    const author_id = req.user;
    //Name of the dropdown of the post tag tagdropdown
    //var postTag = req.body.tagdropdown;

    const newPost = await pool.query(
      "INSERT INTO post (post_text, user_id) VALUES ($1, $2) RETURNING *;",
      [postText, author_id]
    );

    const postID = newPost.rows[0].post_id;

    const postTags = await pool.query(
      "INSERT INTO post_tags (tag_id, post_id) VALUES ($2, $1) RETURNING *;",
      [postID, postTag]
    );

    res.status(201).json({
      status: "Post Success",
      data: {
        post: newPost.rows[0],
        tags: postTags.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// This renders a page of posts based upon filtering of tags selected during user creation sorted in ascending order of time posted

router.get("/home-feed", authorization, async (req, res) => {
  try {
    var tag = req.body.tagpicker;
    // add a date time filter so its only last 24 hrs
    const filteredFeed = await pool.query(
      "SELECT p.post_id, p.user_id, p.post_text, p.time_posted, ut.tag_id FROM post AS p JOIN user_tags as ut ON ut.user_id = p.user_id JOIN tags AS t on t.tag_id = ut.tag_id WHERE (t.tag_id = '${tag}') ORDER BY time_posted DESC;"
    );
    res.status(200).json({
      status: "feed filtered",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/filtered-feed", authorization, async (req, res) => {
  try {
    //This will select from the 'tagpicker' dropdown within the post functionality

    var tag = req.body.tagpicker;

    let sql =
      "SELECT p.post_id, p.user_id, p.post_text, p.time_posted, pt.tag_id FROM post AS p JOIN post_tags as pt ON pt.post_id = p.post_id JOIN tags AS t on t.tag_id = pt.tag_id WHERE (t.tag_id = ${tag}) ORDER BY time_posted DESC;";

    const filteredFeed = await pool.query(sql);
    res.status(200).json({
      status: "feed filtered",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// This renders a page of posts based upon filtering of two specific tags sorted by tag group in ascending order of time posted

router.get("/filtered-feed2", authorization, async (req, res) => {
  try {
    //This will select from the 'tagpicker' dropdown within the post functionality

    var tag = req.body.tagpicker;
    var tag2 = req.body.tagpicker2;

    let sql =
      "SELECT p.post_id, p.user_id, p.post_text, p.time_posted, pt.tag_id FROM post AS p JOIN post_tags as pt ON pt.post_id = p.post_id JOIN tags AS t on t.tag_id = pt.tag_id WHERE (t.tag_id = ${tag} OR t.tag_id = ${tag2}) ORDER BY time_posted DESC;";

    const filteredFeed = await pool.query(sql);
    res.status(200).json({
      status: "feed filtered",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// update a post
router.put("/update-post", authorization, async (req, res) => {
  try {
    const { postId, postText } = req.body;
    const updatePost = await pool.query(
      "UPDATE post SET post_text = $1 where post_id = $2",
      [postText, postId]
    );
    res.status(201).json({
      status: "Update Success",
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// delete a post
router.delete("/delete-post", authorization, async (req, res) => {
  try {
    const { postId } = req.body;

    const selectedPost = await pool.query(
      "DELETE FROM post WHERE post_id = $1",
      [postId]
    );

    res.status(201).json({
      status: "Delete Success",
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// post a comment
router.post("/create-comment", authorization, async (req, res) => {
  try {
    const { commentText, post_id } = req.body;
    const user_id = req.user;
    const newComment = await pool.query(
      "INSERT INTO comment (comment_text, user_id, post_id) VALUES ($1, $2, $3) RETURNING *",
      [commentText, user_id, post_id]
    );
    res.status(201).json({
      status: "Comment Success",
    });
  } catch (err) {
    console.log("Hi");
    res.status(500).send("Server error");
  }
});

//This renders all-posts in the past 24 hours sorted in Ascending order
router.get("/all-posts", authorization, async (req, res) => {
  try {
    const allFeed = await pool.query(
      "SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
        "'24 HOURS' AND NOW() ORDER BY time_posted DESC;"
    );

    /* For future reference, this is how to order by upvotes. */
    // const allFeed = await pool.query
    // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
    // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

    const numAllPosts = allFeed.rowCount;

    res.status(201).json({
      postCount: numAllPosts,
      data: {
        post: allFeed.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//INCOMPLETE: This renders home-posts in the past 24 hours sorted in Ascending order
//This is filtered by the selected tags on profile
router.get("/home-posts", authorization, async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//INCOMPLETE: This renders search-posts in the past 24 hours.
//The user selects < 5 tags for search
router.get("/search-posts", authorization, async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// delete a comment
router.delete("/delete-comment", authorization, async (req, res) => {
    try {
        const { comment_id } = req.body;
        // code to select any single comment
        const deletedComment = await pool.query("DELETE FROM comment WHERE comment_id = $1 RETURNING *", [comment_id]);
        res.status(201).json({
            status: "Deleted comment"
        });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// edit a comment

// get post votes
router.get('/post-votes', authorization, async (req, res) => {
    try {
        const { post_id } = req.body;
        const postVotes = await pool.query("SELECT * FROM post_votes WHERE post_id = $1", [post_id]); 
        res.status(201).send(postVotes.rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// get comment votes
router.get('/comment-votes', authorization, async (req, res) => {
    try {
        const { comment_id } = req.body;
        const commentVotes = await pool.query("SELECT * FROM comment_votes WHERE comment_id = $1", [comment_id]);
        res.status(201).send(commentVotes.rows);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// add/undo post vote
router.post("/post-vote", authorization, async (req, res) => {
    try {
        const { user_id, post_id, vote_value } = req.body;
        // if the same vote from the same person on the same post exists  
        const exactDuplicate = await pool.query("SELECT * FROM post_votes WHERE (user_id = $1 AND post_id = $2 AND vote_value = $3)", [user_id, post_id, vote_value]);
        if (exactDuplicate.rows.length > 0) {
            const deleteVote = await pool.query("DELETE FROM post_votes WHERE (user_id = $1 AND post_id = $2 AND vote_value = $3)", [user_id, post_id, vote_value]);
        }
        else {
          try {
              const insertVote = await pool.query("INSERT INTO post_votes VALUES($1, $2, $3) RETURNING *",
              [user_id, post_id, vote_value]);
          } catch (err) {
              const updateVote = await pool.query("UPDATE post_votes SET vote_value = $1 WHERE (user_id = $2 AND post_id = $3) RETURNING *", [vote_value, user_id, post_id]);
          }
        }
      res.status(201).send("Complete");
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// add/undo comment voes
router.post("/comment-vote", authorization, async (req, res) => {
  try {
      const { user_id, comment_id, vote_value } = req.body;
      // if the same vote from the same person on the same post exists  
      const exactDuplicate = await pool.query("SELECT * FROM comment_votes WHERE (user_id = $1 AND comment_id = $2 AND vote_value = $3)", [user_id, comment_id, vote_value]);
      if (exactDuplicate.rows.length > 0) {
          const deleteVote = await pool.query("DELETE FROM comment_votes WHERE (user_id = $1 AND comment_id = $2 AND vote_value = $3)", [user_id, comment_id, vote_value]);
      }
      else {
        try {
            const insertVote = await pool.query("INSERT INTO comment_votes VALUES($1, $2, $3) RETURNING *",
            [user_id, comment_id, vote_value]);
        } catch (err) {
            const updateVote = await pool.query("UPDATE comment_votes SET vote_value = $1 WHERE (user_id = $2 AND comment_id = $3) RETURNING *", [vote_value, user_id, comment_id]);
        }
      }
    res.status(201).send("Complete");
  } catch (err) {
      res.status(500).send({ error: err.message });
  }
});

module.exports = router;
