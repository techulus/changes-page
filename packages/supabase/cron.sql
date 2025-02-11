-- Scheduled post publish
SELECT cron.schedule('* * * * *', $$update posts set publish_at = null, status = 'published', publication_date = now() where status = 'publish_later' and publish_at is not null and now() > publish_at$$);

-- Remove all email subscribers that is not verified and created more than 1 hour ago
SELECT cron.schedule('*/15 * * * *', $$delete from page_email_subscribers where status = 'not_verified' and now() > valid_till$$);

-- Remove all page views older than 1 month
SELECT cron.schedule('0 0 * * *', $$delete from page_views where created_at < now() - interval '1 month'$$);

-- Remove all cron job logs older than 1 month
select cron.schedule('0 0 * * *', $$delete from cron.job_run_details where end_time < now() - interval '7 days'$$);

-- Remove all expired team invitations
select cron.schedule('*/15 * * * *', $$delete from team_invitations where expires_at < now() and status = 'pending'$$);
