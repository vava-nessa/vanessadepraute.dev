import { useTranslation } from "react-i18next";
import { ActivityCalendar, Activity, ThemeInput } from "react-activity-calendar";
import { useEffect, useState } from "react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import "./GitHubCalendar.css";

interface GitHubCalendarProps {
  username: string;
  theme?: "light" | "dark";
}

export default function GitHubCalendar({ username, theme = "dark" }: GitHubCalendarProps) {
  const { t } = useTranslation();
  const { handleError } = useErrorHandler("GitHubCalendar");
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();

  // Determine earliest year (GitHub was founded in 2008, but we can go back to when user joined)
  const earliestYear = 2008;

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);

        const token = import.meta.env.VITE_GITHUB_TOKEN;

        if (!token) {
          throw new Error("GitHub token is required to fetch contribution data");
        }

        // Calculate date range for selected year
        const from = `${selectedYear}-01-01T00:00:00Z`;
        const to = `${selectedYear}-12-31T23:59:59Z`;

        // GraphQL query to fetch contribution calendar for specific year (includes private repos)
        const query = `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      contributionLevel
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { username, from, to }
          })
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        // Extract contribution data from GraphQL response
        const weeks = result.data.user.contributionsCollection.contributionCalendar.weeks;
        const activities: Activity[] = [];

        weeks.forEach((week: any) => {
          week.contributionDays.forEach((day: any) => {
            // Map GitHub's contributionLevel (NONE, FIRST_QUARTILE, etc.) to numeric levels
            const levelMap: Record<string, number> = {
              'NONE': 0,
              'FIRST_QUARTILE': 1,
              'SECOND_QUARTILE': 2,
              'THIRD_QUARTILE': 3,
              'FOURTH_QUARTILE': 4
            };

            activities.push({
              date: day.date,
              count: day.contributionCount,
              level: levelMap[day.contributionLevel] || 0
            });
          });
        });

        setData(activities);
      } catch (error) {
        handleError(error, { action: "fetch_github_data" });
        // Set empty data on error
        setData([]);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchGitHubData();
  }, [username, selectedYear, handleError]);

  const handlePreviousYear = () => {
    if (selectedYear > earliestYear) {
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear(selectedYear + 1);
    }
  };

  const customTheme: ThemeInput = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
  };

  // Only show full loading state on initial load
  if (isInitialLoad && loading) {
    return (
      <div className="github-calendar-container">
        <div className="github-calendar-loading">
          {t("githubCalendar.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="github-calendar-container">
      <div className="github-calendar-header">
        <h2 className="github-calendar-title">
          {t("githubCalendar.title")}
        </h2>
        <p className="github-calendar-subtitle">
          {t("githubCalendar.subtitle")}
        </p>
      </div>

      {/* Year Navigation */}
      <div className="github-calendar-year-nav">
        <button
          onClick={handlePreviousYear}
          disabled={selectedYear <= earliestYear || loading}
          className="year-nav-button"
          aria-label="Previous year"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className="year-display">{selectedYear}</span>

        <button
          onClick={handleNextYear}
          disabled={selectedYear >= currentYear || loading}
          className="year-nav-button"
          aria-label="Next year"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="github-calendar-wrapper">
        <div className={`github-calendar-content ${loading && !isInitialLoad ? 'loading' : ''}`}>
          {data.length === 0 ? (
            <div className="github-calendar-empty">
              <p className="text-neutral-400 text-center py-8">
                {loading
                  ? t("githubCalendar.loading")
                  : t("githubCalendar.noData", "No contribution data available for this year")
                }
              </p>
            </div>
          ) : (
            <ActivityCalendar
              data={data}
              theme={customTheme}
              colorScheme={theme}
              blockSize={12}
              blockMargin={4}
              fontSize={14}
              labels={{
                legend: {
                  less: t("githubCalendar.legend.less"),
                  more: t("githubCalendar.legend.more")
                },
                totalCount: `{{count}} ${t("githubCalendar.contributions")} ${t("githubCalendar.in")} {{year}}`
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
