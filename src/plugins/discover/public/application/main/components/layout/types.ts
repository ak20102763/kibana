/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Query, TimeRange, AggregateQuery } from '@kbn/es-query';
import type { DataView } from '@kbn/data-views-plugin/public';
import type { DataViewListItem, ISearchSource } from '@kbn/data-plugin/public';
import { SavedSearch } from '@kbn/saved-search-plugin/public';
import { DataTableRecord } from '../../../../types';
import { AppState, GetStateReturn } from '../../services/discover_state';
import { DataRefetch$, SavedSearchData } from '../../hooks/use_saved_search';
import type { DiscoverSearchSessionManager } from '../../services/discover_search_session';
import type { InspectorAdapters } from '../../hooks/use_inspector';

export interface DiscoverLayoutProps {
  dataView: DataView;
  dataViewList: DataViewListItem[];
  inspectorAdapters: InspectorAdapters;
  navigateTo: (url: string) => void;
  onChangeDataView: (id: string) => void;
  onUpdateQuery: (
    payload: { dateRange: TimeRange; query?: Query | AggregateQuery },
    isUpdate?: boolean
  ) => void;
  resetSavedSearch: () => void;
  expandedDoc?: DataTableRecord;
  setExpandedDoc: (doc?: DataTableRecord) => void;
  savedSearch: SavedSearch;
  savedSearchData$: SavedSearchData;
  savedSearchRefetch$: DataRefetch$;
  searchSource: ISearchSource;
  state: AppState;
  stateContainer: GetStateReturn;
  persistDataView: (dataView: DataView) => Promise<DataView | undefined>;
  updateDataViewList: (dataViews: DataView[]) => Promise<void>;
  updateAdHocDataViewId: (dataView: DataView) => Promise<DataView>;
  adHocDataViewList: DataView[];
  searchSessionManager: DiscoverSearchSessionManager;
  savedDataViewList: DataViewListItem[];
}
