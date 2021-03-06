import { ICommandBarItemProps } from '@fluentui/react';
import { useMemo, useState } from 'react';
import { renderRepoLanguage } from '../github-explorer.repo-list.component';
import { GithubRepo } from '../../../api/github-repos.types';
import type { useLocalStarredRepos } from '../../../util/local-storage.hooks';

export interface GithubExplorerCommandBarOptions {
    hideStar?: boolean;
    hideUnStar?: boolean;
}

function isNonNull<T>(item: T | null | undefined): item is T {
    return item != null;
}

export const useGithubExplorerCommandBar = (
    availableLanguages: string[],
    selectedRepos: GithubRepo[],
    { addStarredRepo, deleteStarredRepo }: ReturnType<typeof useLocalStarredRepos>['actions'],
    options?: GithubExplorerCommandBarOptions,
) => {
    const [filteredLanguages, setFilteredLanguages] = useState(() => new Set<string>());

    const items = useMemo<ICommandBarItemProps[]>(() => {
        return [
            options?.hideStar === true
                ? null
                : {
                      key: 'star_repo',
                      text: 'Star',
                      disabled: selectedRepos?.length <= 0,
                      iconProps: {
                          iconName: 'FavoriteStarFill',
                      },
                      onClick() {
                          selectedRepos.forEach(addStarredRepo);
                      },
                  },
            options?.hideUnStar === true
                ? null
                : {
                      key: 'unstar_repo',
                      text: 'Unstar',
                      disabled: selectedRepos?.length <= 0,
                      iconProps: {
                          iconName: 'FavoriteStar',
                      },
                      onClick() {
                          selectedRepos.forEach(deleteStarredRepo);
                      },
                  },
        ].filter(isNonNull);
    }, [addStarredRepo, deleteStarredRepo, options?.hideStar, options?.hideUnStar, selectedRepos]);

    const languageFilterItem = useMemo<ICommandBarItemProps>(
        () => ({
            key: 'language_filter',
            iconProps: {
                iconName: 'Filter',
            },
            checked: filteredLanguages.size > 0,
            subMenuProps: {
                items: availableLanguages.map((language) => ({
                    key: language,
                    text: renderRepoLanguage(language),
                    iconProps: {
                        iconName: filteredLanguages.has(language) ? 'CheckMark' : 'LocaleLanguage',
                    },
                    onClick(ev) {
                        ev?.stopPropagation();
                        ev?.preventDefault();

                        setFilteredLanguages((oldFilteredLanguages) => {
                            const newFilteredLanguages = new Set(oldFilteredLanguages);

                            if (oldFilteredLanguages.has(language)) {
                                newFilteredLanguages.delete(language);
                            } else {
                                newFilteredLanguages.add(language);
                            }

                            return newFilteredLanguages;
                        });
                    },
                })),
            },
        }),
        [availableLanguages, filteredLanguages],
    );

    const farItems = useMemo(() => [languageFilterItem], [languageFilterItem]);

    return {
        filteredLanguages,
        barProps: {
            items,
            farItems,
        },
    };
};
