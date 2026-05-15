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

    <p class="text-sm text-[var(--brand-muted)]">
      {{ filteredPosts.length }} post{{ filteredPosts.length !== 1 ? 's' : '' }} match
      <template v-if="totalPages > 1">
        &mdash; Page {{ currentPage }} of {{ totalPages }}
      </template>
    </p>

    <div v-if="paginatedPosts.length > 0" class="grid gap-6 md:grid-cols-2">
      <article
        v-for="post in paginatedPosts"
        :key="post.slug"
        class="group flex h-full flex-col rounded-3xl border border-[var(--brand-border)]/80 bg-[var(--brand-surface)] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-muted)]">
          <a
            :href="`/categories/${slugify(post.category)}/`"
            class="rounded-full bg-[var(--brand)] px-3 py-1 text-[var(--brand-foreground)] transition group-hover:bg-[var(--brand)]"
          >
            {{ post.category }}
          </a>
          <time :datetime="post.pubDate">{{ formatDate(post.pubDate) }}</time>
        </div>

        <h3 class="mt-4 text-2xl font-semibold leading-tight text-[var(--brand-foreground-color)] transition group-hover:text-[var(--brand)]">
          <a :href="`/post/${post.slug}/`">{{ post.title }}</a>
        </h3>

        <p class="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{{ cleanDescription(post.description) }}</p>

        <a :href="`/post/${post.slug}/`" class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] transition hover:opacity-80">
          Read more
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>

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

    <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4" aria-label="Blog pagination">
      <button
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
        class="inline-flex items-center gap-1 rounded-xl border border-[var(--brand-border)] px-4 py-2 text-sm font-medium text-[var(--brand-muted)] transition hover:border-[var(--brand-soft)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Previous
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          :disabled="page === '…'"
          :class="[
            'min-w-[2.25rem] rounded-xl px-3 py-2 text-sm font-medium transition',
            page === currentPage
              ? 'bg-[var(--brand)] text-[var(--brand-foreground)] shadow-sm'
              : page === '…'
                ? 'cursor-default text-[var(--brand-muted)]'
                : 'text-[var(--brand-muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]',
          ]"
          @click="typeof page === 'number' && goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
        class="inline-flex items-center gap-1 rounded-xl border border-[var(--brand-border)] px-4 py-2 text-sm font-medium text-[var(--brand-muted)] transition hover:border-[var(--brand-soft)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { slugify } from '../lib/slug';

const POSTS_PER_PAGE = 20;

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
const currentPage = ref(1);

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

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / POSTS_PER_PAGE)));

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE;
  return filteredPosts.value.slice(start, start + POSTS_PER_PAGE);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages: (number | '…')[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('…');

  pages.push(total);

  return pages;
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

watch(query, () => {
  currentPage.value = 1;
});

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});

function cleanDescription(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s*\[…\]\s*$/, '');
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}
</script>
