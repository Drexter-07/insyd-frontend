'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createArticle, createJob } from '@/lib/api';

export const CreatePostWidget = ({ currentUser, onPostCreated }) => {
    const [articleTitle, setArticleTitle] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateArticle = async () => {
        if (!articleTitle || !articleContent) {
            alert("Please fill in both title and content for the article.");
            return;
        }
        setIsLoading(true);
        try {
            const newPost = await createArticle({
                actorId: currentUser.id,
                title: articleTitle,
                content: articleContent,
            });
            // Add 'type' and author info so the feed can render it correctly
            const fullPostData = { ...newPost, type: 'article', author_name: currentUser.name, author_job_role: currentUser.job_role, content: articleContent };
            onPostCreated(fullPostData); // Tell the parent page about the new post
            setArticleTitle('');
            setArticleContent('');
        } catch (error) {
            alert("Failed to create article. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateJob = async () => {
        if (!jobTitle || !companyName || !location) {
            alert("Please fill in all fields for the job posting.");
            return;
        }
        setIsLoading(true);
        try {
            const newJob = await createJob({
                actorId: currentUser.id,
                title: jobTitle,
                company_name: companyName,
                location: location,
            });
            const fullJobData = { ...newJob, type: 'job', company_name: companyName, location: location };
            onPostCreated(fullJobData);
            setJobTitle('');
            setCompanyName('');
            setLocation('');
        } catch (error) {
            alert("Failed to create job. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <Tabs defaultValue="article">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="article">Create Article</TabsTrigger>
                        <TabsTrigger value="job">Post Job</TabsTrigger>
                    </TabsList>
                    <TabsContent value="article" className="space-y-3 pt-4">
                        <Input placeholder="Article Title" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} />
                        <Textarea placeholder={`What's on your mind, ${currentUser?.name}?`} value={articleContent} onChange={(e) => setArticleContent(e.target.value)} />
                        <Button onClick={handleCreateArticle} disabled={isLoading}>{isLoading ? 'Posting...' : 'Post Article'}</Button>
                    </TabsContent>
                    <TabsContent value="job" className="space-y-3 pt-4">
                        <Input placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                        <Input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        <Input placeholder="Location (e.g., Mumbai)" value={location} onChange={(e) => setLocation(e.target.value)} />
                        <Button onClick={handleCreateJob} disabled={isLoading}>{isLoading ? 'Posting...' : 'Post Job'}</Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
