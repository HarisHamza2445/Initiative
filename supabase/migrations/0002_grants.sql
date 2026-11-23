-- Table privileges. Newer Supabase projects don't grant these automatically;
-- row-level security (0001) still decides which rows each role can see or change.
grant usage on schema public to anon, authenticated, service_role;

grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

grant select on public.volunteer_applications to authenticated;
grant select, update on public.pledges to authenticated;

grant all on public.admins, public.site_content, public.volunteer_applications, public.pledges to service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
