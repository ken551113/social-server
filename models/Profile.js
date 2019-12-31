const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  handle:{
    type: String,
    required: true,
    max: 40
  },
  website:{
    type: String,
  },
  location:{
    type: String,
  },
  company:{
    type: String,
  },
  status:{
    type: String,
    required: true,
  },
  skills:{
    type: [String],
    required: true,
  },
  bio:{
    type: String,
  },
  githubusername:{
    type: String
  },
  experience:[
    {
      current:{
        type: Boolean,
        default: true
      },
      title:{
        type: String,
        required: true,
      },
      company:{
        type: String,
        required:true,
      },
      location:{
        type: String,
      },
      from:{
        type: String,
        required:true,
      },
      to:{
        type: String,
      },
      description:{
        type: String,
      }
    }
  ],
  education:[
    {
      current:{
        type: Boolean,
        default: true,
      },
      school:{
        type: String,
        required: true,
      },
      degree:{
        type: String,
        required: true,
      },
      fieldofstudy:{
        type: String,
        required: true,
      },
      from:{
        type: String,
        required: true,
      },
      to:{
        type: String,
      },
      description:{
        type: String,
      }
    }
  ],
  social:{
    facebook:{
      type: String,
    },
    instagram:{
      type: String,
    },
    linkedin:{
      type: String,
    }
  }
})

module.exports = mongoose.model("Profile",ProfileSchema);