import { PostStatus, PostType, URL_SLUG_REGEX } from "@changes-page/supabase/types/page";
import { array, boolean, mixed, object, string } from "yup";

export const NewPageSchema = object().shape({
  url_slug: string()
    .min(4, "Too Short!")
    .max(24, "Too Long!")
    .required("Enter a valid url")
    .matches(URL_SLUG_REGEX, "Enter a valid url"),
  title: string()
    .required("Enter a valid title")
    .min(2, "Title too Short!")
    .max(50, "Title too Long!"),
  description: string()
    .min(2, "Description too Short!")
    .max(500, "Description too Long!"),
  type: string().required("Enter a valid type"),
});

export const NewPostSchema = object().shape({
  title: string()
    .required("Title cannot be empty")
    .min(2, "Title too Short!")
    .max(75, "Title too Long!"),
  content: string()
    .required("Content cannot be empty")
    .min(2, "Content too Short!")
    .max(9669, "Content too Long!"),
  tags: array()
    .of(mixed<PostType>().oneOf(Object.values(PostType)))
    .required("Enter valid tags"),
  status: mixed<PostStatus>()
    .oneOf(Object.values(PostStatus))
    .required("Enter valid status"),
  page_id: string(),
  images_folder: string(),
  publish_at: string().optional().nullable(),
  publication_date: string().optional().nullable(),
  allow_reactions: boolean(),
  email_notified: boolean(),
  notes: string().optional().nullable(),
});

export const NewTeamSchema = object().shape({
  name: string().required("Name is required").min(3, "Name must be at least 3 characters long"),
  image: string().optional().nullable(),
});
