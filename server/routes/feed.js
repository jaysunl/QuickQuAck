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
    const { postText, postTag, num_comments } = req.body;
    const author_id = req.user;
    //Name of the dropdown of the post tag tagdropdown
    //var postTag = req.body.tagdropdown;

    const newPost = await pool.query(
      "INSERT INTO post (post_text, user_id, num_comments) VALUES ($1, $2, $3) RETURNING *;",
      [postText, author_id, num_comments]
    );

    const postID = newPost.rows[0].post_id;

    for (const i of postTag) {
      console.log("Console says " + i);
      const postTags = await pool.query(
        "INSERT INTO post_tags (tag_id, post_id) VALUES ($2, $1) RETURNING *;",
        [postID, i]
      );
    }

    const nameAdjectives = [
      "Red",
      "Orange",
      "Yellow",
      "Green",
      "Blue",
      "Purple",
      "Pink",
      "Gray",
      "Turquoise",
      "Brown",
    ];
    const nameAnimals = [
      "Dog",
      "Cat",
      "Raccoon",
      "Giraffe",
      "Elephant",
      "Panda",
      "Koala",
      "Rabbit",
      "Turtle",
      "Fox",
    ];

    const adjIndex = parseInt(Math.random() * 10);
    const animalIndex = parseInt(Math.random() * 10);

    let anonAdj = nameAdjectives[adjIndex];
    let anonAnimal = nameAnimals[animalIndex];
    const anonName = anonAdj + " " + anonAnimal;

    const createAnonName = await pool.query(
      "INSERT INTO anon_names (anon_name_id) VALUES ($1) ON CONFLICT DO NOTHING;",
      [anonName]
    );

    const postName = await pool.query(
      "INSERT INTO post_names (user_id, anon_name_id, post_id) VALUES ($1, $2, $3) RETURNING *;",
      [author_id, anonName, postID]
    );

    ///postTags is declared in a loop so it is not defined here

    res.status(201).json({
      status: "Post Success",
      data: {
        post: newPost.rows[0],
        tags: postTags.rows[0],
        anonName: postName.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

router.post("/user-tag-selection", async (req, res) => {
  try {
    //Reading information contained in post
    const { postTag } = req.body;
    const { user_id } = req.body;

    //hardcoded author_id cuz idk how to pull on it using req.user
    // const author_id = "5bae78ef-8641-4d9c-837d-b78fb4c158fb";

    for (const i of postTag) {
      console.log("Console says " + i);
      const postTags = await pool.query(
        "INSERT INTO user_tags (tag_id, user_id) VALUES ($2, $1) RETURNING *;",
        [user_id, i]
      );
      console.log(i);
    }

    ///postTags is declared in a loop so it is not defined here
    res.status(201).json({
      status: "Tag's have been inserted",
      data: {
        tags: postTags.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// This renders a page of posts based upon filtering of tags selected during user creation sorted in ascending order of time posted

//
router.get("/home-feed", authorization, async (req, res) => {
  const user_id = req.user;

  try {
    // add a date time filter so its only last 24 hrs
    console.log("This is UID " + user_id);
    const homeFeed = await pool.query(
      "SELECT * FROM (SELECT DISTINCT ON (P.post_id) P.post_id, UT.tag_id, P.post_text, P.time_posted, p.num_comments, AGE(NOW(), p.time_posted) AS post_age FROM User_Tags AS UT Inner Join Post_Tags AS PT ON (UT.tag_id = PT.tag_id) Inner Join Post AS P ON (PT.post_id = P.Post_id) WHERE UT.User_id = $1) AS SB ORDER BY SB.time_posted DESC;",
      [user_id]
    );

    res.status(201).json({
      data: {
        post: homeFeed.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// router.get("/filtered-feed", authorization, async (req, res) => {
//   try {
//     //This will select from the 'tagpicker' dropdown within the post fuponctionality

//     var tag = req.body.tagpicker;

//     let sql =
//       "SELECT p.post_id, p.user_id, p.post_text, p.time_posted, pt.tag_id FROM post AS p JOIN post_tags as pt ON pt.post_id = p.post_id JOIN tags AS t on t.tag_id = pt.tag_id WHERE (t.tag_id = ${tag}) ORDER BY time_posted DESC;";

//     const filteredFeed = await pool.query(sql);
//     res.status(200).json({
//       status: "feed filtered",
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// update a post
router.put("/update-post", authorization, async (req, res) => {
  try {
    const { post_id, postText, num_comments } = req.body;

    //Only update if postText is not empty
    if (postText) {
      const updatePost = await pool.query(
        "UPDATE post SET post_text = $1 where post_id = $2",
        [postText, post_id]
      );
    }

    //Only update if num_comments is not empty
    if (num_comments) {
      const updatePost = await pool.query(
        "UPDATE post SET num_comments = $1 where post_id = $2",
        [num_comments, post_id]
      );

      console.log("value: " + num_comments);
    }

    res.status(201).json({
      status: "Update Success",
    });
  } catch (err) {
    res.status(500).json("Server error");
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
    res.status(500).json("Server error");
  }
});

// post a comment
router.post("/create-comment", authorization, async (req, res) => {
  try {
    const { commentText, post_id } = req.body;
    const user_id = req.user;
    const newComment = await pool.query(
      "INSERT INTO comment (text, user_id, post_id) VALUES ($1, $2, $3) RETURNING *",
      [commentText, user_id, post_id]
    );
    res.status(201).json({
      status: "Comment Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server error");
  }
});

//Get comments from given post_id as a query parameter
router.get("/post-comments", authorization, async (req, res) => {
  try {
    const { post_id } = req.query;

    const allComment = await pool.query(
      "SELECT * FROM comment WHERE post_id=($1)",
      [post_id]
    );

    /* For future reference, this is how to order by upvotes. */
    // const allFeed = await pool.query
    // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
    // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

    res.status(201).json({
      data: {
        comment: allComment.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//This renders all-posts in the past 24 hours sorted in Ascending order
router.get("/all-posts", authorization, async (req, res) => {
  try {
    const allFeed = await pool.query(
      "SELECT post.post_id AS post_id, post.user_id AS user_id, post_text, num_comments, AGE(NOW(), time_posted) AS post_age, post_names.anon_name_id AS anon_name FROM post INNER JOIN post_names ON post.user_id = post_names.user_id AND post.post_id = post_names.post_id WHERE time_posted BETWEEN NOW() - INTERVAL'24 HOURS' AND NOW() ORDER BY time_posted DESC;"
    );

    /* For future reference, this is how to order by upvotes. */
    // const allFeed = await pool.query
    // ("SELECT * FROM post WHERE time_posted BETWEEN NOW() - INTERVAL" +
    // "'24 HOURS' AND NOW() ORDER BY votevalue DESC;");

    res.status(201).json({
      data: {
        post: allFeed.rows,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
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

<<<<<<< HEAD

=======
// create a poll (cannot edit once created)
router.post("/create-poll", authorization, async (req, res) => {
  try {
    const { pollOptions, pollTag, num_comments } = req.body;
    const author_id = req.user;

    const newPoll = await pool.query(
      "INSERT INTO poll (poll_options, user_id, num_comments) VALUES ($1, $2, $3) RETURNING *;", [postText, author_id, num_comments]);

    const pollID = newPoll.rows[0].poll_id;

    for (const i of pollTag) {
      console.log("Console says " + i);
      const pollTags = await pool.query(
        "INSERT INTO poll_tags (tag_id, post_id) VALUES ($2, $1) RETURNING *;",
        [postID, i]
      );
    }

    const nameAdjectives = [
      "Red",
      "Orange",
      "Yellow",
      "Green",
      "Blue",
      "Purple",
      "Pink",
      "Gray",
      "Turquoise",
      "Brown",
    ];
    const nameAnimals = [
      "Dog",
      "Cat",
      "Raccoon",
      "Giraffe",
      "Elephant",
      "Panda",
      "Koala",
      "Rabbit",
      "Turtle",
      "Fox",
    ];

    const adjIndex = parseInt(Math.random() * 10);
    const animalIndex = parseInt(Math.random() * 10);

    let anonAdj = nameAdjectives[adjIndex];
    let anonAnimal = nameAnimals[animalIndex];
    const anonName = anonAdj + " " + anonAnimal;

    const createAnonName = await pool.query(
      "INSERT INTO anon_names (anon_name_id) VALUES ($1) ON CONFLICT DO NOTHING;",
      [anonName]
    );

    const postName = await pool.query(
      "INSERT INTO post_names (user_id, anon_name_id, post_id) VALUES ($1, $2, $3) RETURNING *;",
      [author_id, anonName, postID]
    );

    ///postTags is declared in a loop so it is not defined here

    res.status(201).json({
      status: "Post Success",
      data: {
        post: newPost.rows[0],
        tags: postTags.rows[0],
        anonName: postName.rows[0],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

// get all poll questions
router.get("/get-poll-questions", authorization, async (req, res) => {
  try {
    const pollQuestions = await pool.query("SELECT * FROM poll");
    res.status(201).send({ pollQuestions });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
})

// get all votes from a single poll
router.get("/get-poll-votes", authorization, async (req, res) => {
  try {
    const { poll_id } = req.body;
    const pollVotes = await pool.query("SELECT * FROM poll_votes WHERE (poll_id = $1)", [poll_id]);
    res.status(201).json({ pollVotes });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// delete a poll
router.delete("/delete-poll", authorization, async (req, res) => {
  try {
    const { poll_id } = req.body;
    const deletedPoll = await pool.query("DELETE FROM poll WHERE (poll_id = $1)", [poll_id]);
    res.status(201).send("Success");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// vote on a poll
router.post("/post-poll-vote", authorization, async (req, res) => {
  try {
    const { poll_id, choice_id } = req.body;
    const { user_id } = req.user;
    const exactDuplicate = await pool.query("SELECT * FROM poll_votes WHERE (user_id = $1 AND poll_id = $2 AND choice_id = $3)", [user_id, poll_id, choice_id]);
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
>>>>>>> e10eba6aa35a829fd12bbbe59c5da2b5a48a7165

module.exports = router;
