<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 rounded-3xl border border-[var(--brand-border)]/80 bg-[var(--brand-surface)]/90 p-5 shadow-sm md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand)]">Search</p>
        <h2 class="mt-1 text-xl font-semibold text-[var(--brand-foreground-color)]">Find posts fast</h2>
        <p class="mt-2 text-sm text-[var(--brand-muted)]">Search by title, description, category, or tag.</p>
      </div>

      <label class="w-full md:max-w-md">
        <span class="sr-only">Search posts</span>
        <input
          v-model="query"
          type="search"
          placeholder="Search posts"
          class="w-full rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-background)] px-4 py-3 text-sm text-[var(--brand-foreground-color)] outline-none ring-0 transition placeholder:text-slate-400 focus:border-[var(--brand-soft)] focus:bg-[var(--brand-surface)] focus:shadow-sm"
        />
      </label>
    </div>

    <p class="text-sm text-[var(--brand-muted)]">{{ filteredPosts.length }} posts match</p>

    <div v-if="filteredPosts.length > 0" class="grid gap-6 md:grid-cols-2">
      <article
        v-for="post in filteredPosts"
        :key="post.slug"
        class="group flex h-full flex-col rounded-3xl border border-[var(--brand-border)]/80 bg-[var(--brand-surface)] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-muted)]">
          <a
            :href="`/categories/${slugify(post.category)}/`"
            class="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[var(--brand)] transition group-hover:bg-[var(--brand-soft)]"
          >
            {{ post.category }}
          </a>
          <time :datetime="post.pubDate">{{ formatDate(post.pubDate) }}</time>
        </div>

        <h3 class="mt-4 text-2xl font-semibold leading-tight text-[var(--brand-foreground-color)] transition group-hover:text-[var(--brand)]">
          <a :href="`/blog/${post.slug}/`">{{ post.title }}</a>
        </h3>

        <p class="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{{ post.description }}</p>

        <div class="mt-5 flex flex-wrap gap-2">
          <a
            v-for="tag in post.tags"
            :key="tag"
            :href="`/tags/${slugify(tag)}/`"
            class="rounded-full border border-[var(--brand-border)] px-3 py-1 text-xs font-medium text-[var(--brand-muted)] transition hover:border-[var(--brand-soft)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
          >
            {{ tag }}
          </a>
        </div>
      </article>
    </div>

    <div v-else class="rounded-3xl border border-dashed border-[var(--brand-border)] bg-[var(--brand-surface)]/70 p-8 text-center text-[var(--brand-muted)]">
      No posts match the current search.
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { slugify } from '../lib/slug';

interface SearchPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  pubDate: string;
}

const props = defineProps<{
  posts: SearchPost[];
}>();

const query = ref('');

const filteredPosts = computed(() => {
  const needle = query.value.trim().toLowerCase();

  if (!needle) {
    return props.posts;
  }

  return props.posts.filter((post) =>
    [post.title, post.description, post.category, ...post.tags].some((value) =>
      value.toLowerCase().includes(needle),
    ),
  );
});

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}
</script>
