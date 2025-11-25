import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String ,//cloudinary url
            required: true
        },
        thumbnail: {
          type: String ,//cloudinary url
          required: true,
        },
           title: {
          type: String ,
          required: true,
        },
        description: {
          type: String ,
          required: true,
        },
         duration: {
          type: Number, //cloudinary
          required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default:true
        },
        VideoOwner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }





    },
    {
        timestamps: true,
    }
)
videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video",videoSchema)




//later like this
// Video.aggregatePaginate(myAggregation, {
//   page: 2,
//   limit: 10
// })

//and its returns
// {
//   docs: [...videos],
//   totalDocs: 120,
//   limit: 10,
//   page: 2,
//   totalPages: 12,
//   hasNextPage: true,
//   nextPage: 3,
//   hasPrevPage: true,
//   prevPage: 1
// }
