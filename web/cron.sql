-- Scheduled post publish
SELECT cron.schedule('* * * * *', $$update posts set publish_at = null, status = 'published', publication_date = now() where status = 'publish_later' and publish_at is not null and now() > publish_at$$);

-- Remove all email subscribers that is not verified and created more than 1 hour ago
SELECT cron.schedule('*/15 * * * *', $$delete from page_email_subscribers where status = 'not_verified' and now() > valid_till$$);
